import { Character } from "./Character.ts";
import { direction, floors, gridAccessor, rooms } from "./index.ts";
import { Room } from "./Room.ts";

import { Sockpuppet } from "sockpuppet/mod.ts";
import { Channel } from "sockpuppet/Channel.ts";
import { solver } from "../solver.ts";
import { initializeDoodler, Vector } from "doodler";
import { imageLibrary } from "../images.ts";
import { Skeleton } from "./Skeleton.ts";
import { Player } from "./Player.ts";
import { audioLibrary, playRandom } from "../sounds.ts";
import { ZoomableDoodler } from "doodler/zoomableCanvas.ts";
import { Ghost } from "./Ghost.ts";

export class Game {
  rooms: Room[] = [];
  characters: Map<string, Character> = new Map();

  gridSize = { x: 5, y: 6 };

  grid: Map<gridAccessor, Room> = new Map();

  entranceD = { x: 0, y: 0 };

  isHost = false;

  player?: Player;
  players: Map<string, Player> = new Map();

  dialog = document.querySelector("dialog")!;
  dialogContent: string;

  floor: floors = "basement";

  tick = () => {
    this.skeletonCheck();
    this.skeletonMove();
    this.render();
  };

  skeletonCount = 3;

  stairs!: Record<floors, Room>;
  dungeon!: Room;
  entrance!: Room;
  treasureRooms!: Record<floors, Room>;

  constructor() {
    this.dialogContent = this.dialog.innerHTML!;
  }

  generate = () => {
    let solvable = false;
    const allStairs: Record<floors, Room | undefined> = {
      upper: undefined,
      lower: undefined,
      basement: undefined,
    };
    const treasureRooms: Record<floors, Room | undefined> = {
      upper: undefined,
      lower: undefined,
      basement: undefined,
    };
    this.skeletonCount = Number(prompt("How many skeletons?") || "3");
    while (!solvable) {
      const floors: floors[] = ["basement", "lower", "upper"];
      this.grid = new Map();
      this.rooms = [];
      this.characters = new Map();
      for (const floor of floors) {
        const stairX = Math.floor(Math.random() * this.gridSize.x);
        const stairY = Math.floor(Math.random() * this.gridSize.y);
        const stairs = new Room({
          name: "stairs",
          position: { x: stairX, y: stairY },
          level: floor,
        }, this);

        allStairs[floor] = stairs;

        this.grid.set(`${stairX},${stairY},${floor}`, stairs);

        if (floor === "basement") {
          let spaceIsOccupied = false;
          let dungeonX: number;
          let dungeonY: number;
          do {
            dungeonX = Math.floor(Math.random() * this.gridSize.x);
            dungeonY = Math.floor(Math.random() * this.gridSize.y);
            spaceIsOccupied = !!this.grid.get(
              `${dungeonX},${dungeonY},${floor}`,
            );
          } while (spaceIsOccupied);
          const dungeon = new Room({
            name: "dungeon",
            position: { x: dungeonX, y: dungeonY },
            level: floor,
          }, this);

          this.grid.set(`${dungeonX},${dungeonY},${floor}`, dungeon);
          this.dungeon = dungeon;
        }

        if (floor === "lower") {
          let entranceX: number;
          const entranceY = this.gridSize.y - 1;
          let spaceIsOccupied = false;
          do {
            entranceX = Math.floor(Math.random() * this.gridSize.x);
            spaceIsOccupied = !!this.grid.get(
              `${entranceX},${entranceY},${floor}`,
            );
          } while (spaceIsOccupied);
          const entrance = new Room({
            name: "entrance",
            position: { x: entranceX, y: entranceY },
            level: floor,
          }, this);
          entrance.known = true;

          this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
          this.entranceD = {
            x: entranceX,
            y: entranceY,
          };

          this.entrance = entrance;
        }

        for (let x = 0; x < this.gridSize.x; x++) {
          for (let y = 0; y < this.gridSize.y; y++) {
            if (!this.grid.get(`${x},${y},${floor}`)) {
              const validRooms = rooms.filter((r) => r.floors.includes(floor));

              const selectedRoom =
                validRooms[Math.floor(Math.random() * validRooms.length)];
              const room = new Room({
                name: selectedRoom.name,
                level: floor,
                position: { x, y },
              }, this);

              this.grid.set(`${x},${y},${floor}`, room);
            }
          }
        }
      }

      for (const floor of floors) {
        for (let x = 0; x < this.gridSize.x; x++) {
          for (let y = 0; y < this.gridSize.y; y++) {
            const room = this.grid.get(`${x},${y},${floor}`);
            room?.generateDoors();
          }
        }

        const bannedRooms: rooms[] = [
          "hallway",
          "stairs",
          "entrance",
          "dungeon",
        ];
        let treasureRoom = this.grid.get(this.randomSelector(floor));
        while (
          !treasureRoom?.doors.length || bannedRooms.includes(treasureRoom.name)
        ) {
          treasureRoom = this.grid.get(this.randomSelector(floor));
        }
        treasureRoom.hasTreasure = true;

        treasureRooms[floor] = treasureRoom;
      }

      for (const room of this.grid.values()) this.rooms.push(room);
      solvable = solver(this.rooms);
    }
    this.stairs = allStairs as Record<floors, Room>;
    this.treasureRooms = treasureRooms as Record<floors, Room>;
    const tunnel1 = this.grid.get(this.randomSelector("basement"))!;
    const tunnel2 = this.grid.get(this.randomSelector())!;
    tunnel1.secretTunnel = tunnel2;
    tunnel2.secretTunnel = tunnel1;

    tunnel1.tunnelKnown = true;
    tunnel2.tunnelKnown = true;
  };

  init = () => {
    const rooms = Array.from(this.grid.values()).sort((a) => {
      if (a.level === "basement") return -1;
      if (a.level === "lower") return 0;
      if (a.level === "upper") return 1;
      return 0;
    }).sort((a, b) => {
      const posA = a.position;
      const posB = b.position;

      return posA.x - posB.x;
    }).sort((a, b) => {
      const posA = a.position;
      const posB = b.position;

      return posA.y - posB.y;
    });

    document.querySelectorAll(".floor").forEach((f) => f.innerHTML = "");

    for (const room of rooms) {
      const floor = document.querySelector(`.floor#${room.level}`);
      const div = document.createElement("div");
      // div.textContent = `${room.name}, ${room.position.x}, ${room.position.y}`;
      div.textContent = room.name;
      div.classList.add(...room.doors);
      div.classList.add("hidden");
      for (const character of this.characters.values()) {
        if (character.room === room) div.textContent += " 💀";
      }
      if (room.hasTreasure) div.classList.add("treasure");
      if (room.name === "stairs") div.classList.add("stairs");
      floor?.append(div);
      room.element = div;
    }

    this.player?.init();

    doodler.createLayer(this.renderDoodle);
    if (!this.isHost) {
      doodler.createLayer(() => {
        doodler.drawScaled(10, () => {
          doodler.fillRect(
            new Vector(0, this.gridSize.y).mult(32),
            this.gridSize.x * 32,
            16,
            {
              color: "purple",
            },
          );

          this.player?.item?.render();

          const treasureStart = new Vector(2, this.gridSize.y).mult(32).add(
            2,
            2,
          );

          doodler.drawImage(
            imageLibrary.treasure,
            treasureStart,
            12,
            12,
          );
          doodler.fillText(
            this.player?.gatheredTreasures.length.toString() || "0",
            treasureStart.copy().add(16, 6),
            16,
            {
              fillColor: "white",
              textBaseline: "middle",
            },
          );

          doodler.fillText(
            "Score " + this.player?.score,
            treasureStart.copy().add(48, 6),
            44,
            {
              fillColor: "white",
              textBaseline: "middle",
            },
          );
        });
      });
    }
  };

  renderDoodle = () => {
    const rooms = this.rooms;
    doodler.drawScaled(10, () => {
      for (
        const room of rooms.filter((r) => r.level === this.floor || this.isHost)
      ) {
        this.isHost
          ? room.render(
            new Vector(
              Room.FloorZ[room.level] * this.gridSize.x,
              0,
            ),
          )
          : room.render();
      }
    });
  };
  render = () => {
    // if (!this.isHost) {
    //   document.querySelectorAll<HTMLDivElement>(".floor[data-floor]").forEach(
    //     (f) => {
    //       const floor = f.dataset.floor;

    //       if (floor === this.character?.room?.level) {
    //         f.classList.remove("hidden");
    //       } else {
    //         f.classList.add("hidden");
    //       }
    //     },
    //   );

    //   const nameDict = {
    //     lower: "Ground Floor",
    //     upper: "Upstairs",
    //     basement: "Basement",
    //   };

    //   document.querySelector(".floor-name")!.textContent =
    //     nameDict[this.character!.room!.level];
    //   document.querySelector(".score")!.textContent =
    //     `You have gathered ${this.character?.gatheredTreasures.length} treasures!`;
    // }

    // if (this.isHost) {
    //   document.querySelectorAll<HTMLDivElement>(".floor[data-floor]").forEach(
    //     (f) => {
    //       const floor = f.dataset.floor;

    //       if (floor === this.floor) {
    //         f.classList.remove("hidden");
    //       } else {
    //         f.classList.add("hidden");
    //       }
    //     },
    //   );

    //   const nameDict = {
    //     lower: "Ground Floor",
    //     upper: "Upstairs",
    //     basement: "Basement",
    //   };

    //   document.querySelector(".floor-name")!.textContent = nameDict[this.floor];
    // }
    this.player?.buttons();
  };

  changeFloor = (dir: "up" | "down") => {
    const options = {
      up: {
        basement: "lower",
        upper: "upper",
        lower: "upper",
      },
      down: {
        upper: "lower",
        lower: "basement",
        basement: "basement",
      },
    };

    this.floor = options[dir][this.floor] as floors;
    this.render();
  };

  randomSelector = (floor?: floors): gridAccessor =>
    `${Math.floor(Math.random() * this.gridSize.x)},${
      Math.floor(Math.random() * this.gridSize.y)
    },${floor || floors[Math.floor(Math.random() * floors.length)]}`;

  // TODO: This needs to be refactored now that rooms are aware of characters inside them - this should also be moved to the skeleton class when it gets created
  skeletonCheck = () => {
    for (const character of this.players.values()) {
      skellies:
      for (const skeleton of this.skeletons) {
        if (skeleton.frozen) continue skellies;
        if (
          !character.safe &&
          character.room === skeleton.room
        ) {
          character.room = this.rooms.find((r) => r.name === "dungeon")!;
          this.channel?.send(JSON.stringify({
            action: "captured",
            playerId: character.uuid,
          }));
        } else {
          this.channel?.send(JSON.stringify({
            action: "success",
            playerId: character.uuid,
          }));
        }
      }
    }
  };

  skeletonMove = () => {
    this.ghost.navigate();
    for (const skeleton of this.skeletons) {
      skeleton.navigate();
      this.sendRoom(skeleton.room.uuid, skeleton.uuid);
    }
    this.skeletonCheck();
  };

  checkPlayerMoves = () => {
    if (Array.from(this.players.values()).every((c) => c.hasMoved)) {
      this.tick();
      setTimeout(() => {
        this.players.forEach((c) => c.hasMoved = false);
        this.channel?.send(JSON.stringify({
          action: "unlock",
        }));
      }, 500);
    }
  };

  puppet = new Sockpuppet("wss://sockpuppet.cyborggrizzly.com");

  hostGame = async () => {
    this.initDoodler("red", {
      height: 32 * this.gridSize.y * 10,
      width: 32 * this.gridSize.x * 10 * 3,
    });
    this.isHost = true;
    this.generate();
    this.init();
    const channelId = "spooky_scary_skeletons";
    await this.puppet.createChannel(channelId);

    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case "join": {
          if (!message.playerName) break;
          const char = new Player(message.playerName, this);
          char.uuid = message.playerId;
          char.room = this.entrance;
          this.characters.set(message.playerId, char);
          this.players.set(char.uuid, char);
          const map = this.rooms.map((r) => ({
            name: r.name,
            level: r.level,
            position: r.position,
            hasTreasure: r.hasTreasure,
            doors: r.doors,
            uuid: r.uuid,
            secretTunnelId: r.secretTunnel?.uuid,
          }));
          this.channel?.send(JSON.stringify({
            action: "map",
            map,
          }));
          this.sendRoom(char.room.uuid, char.uuid);
          this.sendMessage({
            action: "scoreboard",
            charsInRoom: Array.from(this.players.values()).map((c) =>
              `${c.uuid},${c.name}`
            ),
            playerId: char.uuid,
          });
          break;
        }
        case "move": {
          const c = this.characters.get(message.playerId)! as Player;
          const room = this.rooms.find((r) => r.uuid === message.roomId);
          if (!room) break;
          // c.room = room;
          // c.hasMoved = true;
          c.move("nav", room);
          this.checkPlayerMoves();
          this.sendRoom(c.room.uuid, c.uuid);
          break;
        }
        case "win": {
          const buttons = document.querySelector(".buttons");
          const butt = document.createElement("button");
          butt.dataset.dir = "north";
          butt.textContent = "Continue";
          butt.addEventListener("click", () => {
            this.channel?.send(JSON.stringify({ action: "continue" }));
            butt.remove();
          });
          buttons?.append(butt);
          break;
        }
        case "score": {
          const char = this.players.get(message.playerId);
          if (!char) break;
          char._score = message.score || 0;
          break;
        }
        case "safe": {
          const char = this.players.get(message.playerId);
          if (!char) break;
          char.safe = !!message.safe;
          break;
        }
        case "trap": {
          const room = this.rooms.find((r) => r.uuid === message.roomId);
          if (!room) break;
          room.trapCount += 1;
          break;
        }
        case "freeze": {
          for (const skelly of this.skeletons) {
            skelly.frozen += 3;
          }
          break;
        }
        case "dice": {
          const skellies = Array.from(this.characters.values()).filter((c) =>
            c.name === "skeleton"
          );
          const skelly = skellies[Math.floor(Math.random() * skellies.length)];
          if (Math.random() < .3) {
            const players = Array.from(this.characters.values()).filter((c) =>
              c.name !== "ghost" && c.name !== "skeleton"
            );
            skelly.teleportLocation =
              players[Math.floor(Math.random() * players.length)].room;
          }
          break;
        }
        case "music": {
          const room = this.rooms.find((r) => r.uuid === message.roomId!);
          if (!room) break;
          for (const skelly of this.skeletons) {
            skelly.targetRoom.push(room);
            skelly.targetingTurns = 5;
          }
          break;
        }
        case "noise": {
          this.ghost.hear(message.playerId);
          break;
        }
      }
    });

    this.channel = this.puppet.getChannel(channelId);
  };

  skeletons: Skeleton[] = [];
  ghost!: Ghost;

  startGame = () => {
    for (let i = 0; i < this.skeletonCount; i++) {
      const skeleton = new Skeleton(i, this);
      skeleton.room = this.grid.get(this.randomSelector())!;
      while (skeleton.room.name === "entrance") {
        skeleton.room = this.grid.get(this.randomSelector())!;
      }
      this.characters.set(skeleton.uuid, skeleton);
      this.sendRoom(skeleton.room.uuid, skeleton.uuid);
      this.skeletons.push(skeleton);
    }
    this.ghost = new Ghost(this);
    this.channel?.send(JSON.stringify({ action: "unlock" }));
    const buttons = document.querySelector(".buttons");
    buttons!.innerHTML = `
    <button class="movement" data-dir="up">Up</button>
    <button class="movement" data-dir="down">Down</button>`;
    document.querySelectorAll(".movement[data-dir]").forEach((b) => {
      b = b as HTMLButtonElement;
      b.addEventListener(
        "click",
        () =>
          this.changeFloor(
            (b as HTMLButtonElement).dataset.dir as "up" | "down",
          ),
      );
    });

    const unlockButton = document.createElement("button");
    unlockButton.dataset.dir = "c";
    unlockButton.addEventListener("click", () => {
      for (const char of this.players.values()) {
        if (!char.hasMoved) {
          this.characters.delete(char.uuid);
          this.players.delete(char.uuid);
        } else {
          char.hasMoved = false;
        }
      }
      this.channel?.send(JSON.stringify({ action: "unlock" }));
    });
    unlockButton.textContent = "Unlock";

    buttons!.append(unlockButton);

    for (const player of this.players.values()) {
      player.hasMoved = false;
    }
    this.render();
  };

  joinGame = () => {
    this.initDoodler("black", {
      width: 32 * this.gridSize.x * 10,
      height: 32 * this.gridSize.y * 10 + 160,
    });
    this.isHost = false;
    const channelId = "spooky_scary_skeletons";
    this.floor = "lower";
    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case "map": {
          if (!this.rooms.length) {
            const tunnel: Room[] = [];
            const allStairs: Record<floors, Room | undefined> = {
              basement: undefined,
              lower: undefined,
              upper: undefined,
            };
            const treasureRooms: Record<floors, Room | undefined> = {
              basement: undefined,
              lower: undefined,
              upper: undefined,
            };
            this.rooms = message.map!.map((r) => {
              const room = new Room(r, this);
              if (room.name === "stairs") allStairs[room.level] = room;
              if (room.hasTreasure) treasureRooms[room.level] = room;
              if (room.name === "dungeon") this.dungeon = room;
              if (room.name === "entrance") this.entrance = room;
              if (r.secretTunnelId) tunnel.push(room);
              this.grid.set(
                `${room.position.x},${room.position.y},${room.level}`,
                room,
              );
              return room;
            });
            this.stairs = allStairs as Record<floors, Room>;
            this.treasureRooms = treasureRooms as Record<floors, Room>;
            const [room1, room2] = tunnel;
            if (room1 && room2) {
              room1.secretTunnel = room2;
              room2.secretTunnel = room1;
            }
            this.player!.room = this.entrance;
            this.render();
            this.init();
          }
          break;
        }
        case "captured": {
          if (
            this.player?.uuid === message.playerId && !this.player.safe
          ) {
            playRandom("spookyLaugh1", "spookyLaugh2");
            const event = new CustomEvent("captured");
            this.player.room = this.rooms.find((r) => r.name === "dungeon")!;
            dispatchEvent(event);
            this.dialog?.showModal();
            setTimeout(() => {
              this.dialog?.close();
            }, 2000);
          }
          break;
        }
        case "success": {
          if (
            this.player?.gatheredTreasures.length === 3 &&
            this.player.room?.name === "entrance"
          ) {
            this.player.hasWon = true;
            this.dialog!.innerHTML = `
              🎃🎃🎃<br>
              Congratulations! You have collected all of the treasures and escaped to safety!<br>
              🎃🎃🎃
            `;
            this.dialog?.showModal();
            this.channel?.send(JSON.stringify({
              action: "win",
              playerName: this.player.name,
            }));
            this.player.safe = true;
          }
          break;
        }
        case "unlock": {
          this.player!.hasMoved = false;
          this.player?.buttons();
          break;
        }
        case "win": {
          this.player!.hasMoved = true;
          this.dialog!.innerHTML = `
          🎃🎃🎃<br>
          ${message.playerName} has collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
          `;
          this.dialog?.showModal();
          break;
        }
        case "continue": {
          this.player!.hasMoved = false;
          this.player?.buttons();
          this.dialog?.close();
          break;
        }
        case "room": {
          if (
            !this.player ||
            // this.character.room.uuid !== message.roomId ||
            !message.charsInRoom
            // message.playerId === this.character.uuid
          ) break;
          for (const char of message.charsInRoom) {
            const [uuid, name] = char.split(",");
            if (uuid === this.player.uuid) continue;
            let c = this.characters.get(uuid);
            if (!c) {
              switch (name) {
                case "skeleton":
                  c = new Skeleton(this.skeletons.length, this);
                  this.skeletons.push(c as Skeleton);
                  break;
                case "ghost":
                  c = new Ghost(this);
                  this.ghost = c as Ghost;
                  break;
                default:
                  c = new Player(name, this);
                  break;
              }
            }
            c.uuid = uuid;
            this.characters.set(c.uuid, c);
            c.game = this;
            c.room = this.rooms.find((r) => r.uuid === message.roomId)!;
          }
          break;
        }
        case "trap": {
          const room = this.rooms.find((r) => r.uuid === message.roomId);
          if (this.player?.uuid === message.playerId || !room) break;
          room.trapCount += 1;
          break;
        }
        case "ghosted": {
          if (message.playerId !== this.player!.uuid) break;
          this.player?.addPoints(-20, true);
          this.alert("👻 EEEK A GHOST 👻", 2000);
          break;
        }
      }
    });

    this.channel = this.puppet.getChannel(channelId);
  };

  initDoodler = (
    bg: string,
    { height, width, framerate = 5 }: {
      height: number;
      width: number;
      framerate?: number;
    },
    zoom?: boolean,
  ) => {
    if (window.doodler) return;
    initializeDoodler(
      {
        height: height,
        width: width,
        canvas: document.querySelector("canvas") as HTMLCanvasElement,
        bg,
        framerate,
      },
      zoom || false,
      (ctx) => {
        ctx.imageSmoothingEnabled = false;
        ctx.font = "12px spk";
      },
    );
  };

  sendRoom(roomId: string, playerId: string) {
    this.channel?.send(JSON.stringify({
      action: "room",
      roomId,
      playerId,
      charsInRoom: Array.from(
        this.rooms.find((r) => r.uuid === roomId)?.characters.values() || [],
      ).map(
        (c) => `${c.uuid},${c.name}`,
      ),
    }));
  }

  createCharacter = (name: string) => {
    this.player = new Player(name, this);
    this.channel?.send(JSON.stringify({
      action: "join",
      playerId: this.player.uuid,
      playerName: name,
    }));
  };

  channel?: Channel;

  sendMessage(p: socketPacket) {
    this.channel?.send(JSON.stringify(p));
  }

  alertTimer?: number;

  alert(message: string | HTMLElement, time?: number) {
    if (typeof message === "string") {
      this.dialog.innerHTML = message;
    } else {
      this.dialog.append(message);
    }

    this.dialog.showModal();

    if (time) {
      clearTimeout(this.alertTimer);
      this.alertTimer = setTimeout(() => {
        this.dialog.close();
        this.dialog.innerHTML = this.dialogContent;
      }, time);
    }
  }

  startScoreboard() {
    this.initDoodler("#00000050", {
      width: document.body.clientWidth * .9,
      height: document.body.clientHeight * .9,
      framerate: 40,
    }, true);
    doodler.createLayer((c) => {
      c.font = "32px spk";
      const pos = new Vector(12, 12);
      for (const player of this.players.values()) {
        const [gamepad] = navigator.getGamepads();
        if (gamepad) {
          const d = doodler as unknown as ZoomableDoodler;
          const [leftX, leftY] = gamepad.axes;
          const deadzone = 0.04;

          d.moveOrigin({
            x: Math.min(Math.max(leftX - deadzone, 0), leftX + deadzone) * -15,
            y: Math.min(Math.max(leftY - deadzone, 0), leftY + deadzone) * -15,
          });

          if (gamepad.buttons[7].value) {
            d.scaleAt(
              d.screenToWorld(c.canvas.width / 2, c.canvas.height / 2),
              1 + (gamepad.buttons[7].value / 20),
            );
          }
          if (gamepad.buttons[6].value) {
            d.scaleAt(
              d.screenToWorld(c.canvas.width / 2, c.canvas.height / 2),
              1 - (gamepad.buttons[6].value / 20),
            );
          }
        }
        doodler.fillText(
          player.name,
          pos.copy().add(2, 2),
          c.canvas.width / 3,
          {
            fillColor: "purple",
            textBaseline: "top",
          },
        );
        doodler.fillText(player.name, pos, c.canvas.width / 3, {
          fillColor: "orange",
          textBaseline: "top",
        });
        const scorePos = pos.copy().add(c.canvas.width / 3, 0);
        doodler.fillText(
          player.score + " points",
          scorePos.copy().add(2, 2),
          c.canvas.width / 3,
          {
            fillColor: "purple",
            textBaseline: "top",
          },
        );
        doodler.fillText(
          player.score + " points",
          scorePos,
          c.canvas.width / 3,
          {
            fillColor: "orange",
            textBaseline: "top",
          },
        );
        pos.add(0, 36);
      }
    });
    const channelId = "spooky_scary_skeletons";

    document.addEventListener("click", () => {
      audioLibrary.spookyDrone1.loop = true;
      audioLibrary.spookyDrone2.loop = true;
      audioLibrary.spookyDrone1.play();
      audioLibrary.spookyDrone2.play();
    });

    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case "scoreboard": {
          for (const c of message.charsInRoom!) {
            const [uuid, name] = c.split(",");
            const player = new Player(name, this);
            player.uuid = uuid;
            this.players.set(uuid, player);
          }
          break;
        }
        case "score": {
          const player = this.players.get(message.playerId);
          if (!player) break;

          player._score = message.score || 0;
          break;
        }
        case "music": {
          audioLibrary.musicBox.play();
          break;
        }
        case "captured": {
          playRandom("spookyLaugh1", "spookyLaugh2");
        }
      }
    });
  }
}

interface socketPacket {
  action:
    | "join"
    | "move"
    | "win"
    | "captured"
    | "success"
    | "map"
    | "unlock"
    | "continue"
    | "room"
    | "safe"
    | "trap"
    | "freeze"
    | "dice"
    | "scoreboard"
    | "music"
    | "ghosted"
    | "noise"
    | "score";
  playerId: string;
  playerName?: string;
  roomId?: string;
  charsInRoom?: string[];
  direction?: direction | "up" | "down" | "search" | "secret" | "nav";
  map?: Partial<Room>[];
  score?: number;
  safe?: boolean;
}
