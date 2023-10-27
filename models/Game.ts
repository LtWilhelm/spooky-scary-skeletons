import { Character } from "./Character.ts";
import { direction, floors, gridAccessor, rooms } from "./index.ts";
import { Room } from "./Room.ts";

import { Sockpuppet } from "sockpuppet/mod.ts";
import { Channel } from "sockpuppet/Channel.ts";
import { solver } from "../solver.ts";
import { initializeDoodler } from "doodler";
import { Vector } from "https://git.cyborggrizzly.com/emma/doodler/raw/tag/0.0.9d/geometry/vector.ts";
import { imageLibrary } from "../images.ts";

export class Game {
  rooms: Room[] = [];
  characters: Map<string, Character> = new Map();

  gridSize = { x: 5, y: 6 };

  grid: Map<gridAccessor, Room> = new Map();

  entrance = { x: 0, y: 0 };

  isHost = false;

  character?: Character;

  dialog = document.querySelector("dialog")!;

  floor: floors = "basement";

  tick = () => {
    this.skeletonCheck();
    this.skeletonMove();
    this.render();
  };

  skeletonCount = 3;

  generate = () => {
    let solvable = false;
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
          entrance.itemChance = 1;
          entrance.known = true;

          this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
          this.entrance = {
            x: entranceX,
            y: entranceY,
          };
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
      }

      for (const room of this.grid.values()) this.rooms.push(room);
      solvable = solver(this.rooms);
    }
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

    for (const char of this.characters.values()) {
      console.log(char.name, char.room);
    }

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

    this.character?.init();

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

          this.character?.item?.render();

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
            this.character?.gatheredTreasures.length.toString() || "0",
            treasureStart.copy().add(16, 2),
            16,
            {
              fillColor: "white",
              textBaseline: "top",
            },
          );

          doodler.fillText(
            "Score " + this.character?.score,
            treasureStart.copy().add(48, 2),
            44,
            { fillColor: "white" },
          );
        });
      });
    }
  };

  renderDoodle = () => {
    const rooms = this.rooms;
    doodler.drawScaled(10, () => {
      for (const room of rooms.filter((r) => r.level === this.floor)) {
        room.render();
      }
      // if (this.isHost) {
      // } else {
      //   for (
      //     const room of rooms.filter((r) => (r.level === this.floor) && r.known)
      //   ) {
      //     room.render();
      //   }
      // }
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
    this.character?.buttons();
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
    const characters = Array.from(this.characters.values());
    const skeletons = characters.filter((c) => c.name === "skeleton");

    for (const character of characters) {
      if (character.name !== "skeleton") {
        skellies:
        for (const skeleton of skeletons) {
          if (skeleton.frozen) continue skellies;
          console.log(skeleton.frozen);
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
    }
  };

  skeletonMove = () => {
    const characters = Array.from(this.characters.values());
    const skeletons = characters.filter((c) => c.name === "skeleton");

    for (const skeleton of skeletons) {
      skeleton.move();
      this.sendRoom(skeleton.room.uuid, skeleton.uuid);
    }
    this.skeletonCheck();
  };

  checkPlayerMoves = () => {
    const characters = Array.from(this.characters.values()).filter((c) =>
      c.name !== "skeleton"
    );
    if (characters.every((c) => c.hasMoved)) {
      this.tick();
      setTimeout(() => {
        characters.forEach((c) => c.hasMoved = false);
        this.channel?.send(JSON.stringify({
          action: "unlock",
        }));
      }, 2000);
    }
  };

  puppet = new Sockpuppet("wss://sockpuppet.cyborggrizzly.com");

  hostGame = async () => {
    this.initDoodler("red");
    this.isHost = true;
    this.generate();
    this.init();
    const channelId = "spooky_scary_skeletons";
    await this.puppet.createChannel(channelId);

    this.puppet.on("ping", (e) => {
      console.log(e);
    });

    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case "join": {
          if (!message.playerName) break;
          const char = new Character(message.playerName, this);
          char.game = this;
          char.room = this.rooms.find((r) => r.name === "entrance")!;
          char.uuid = message.playerId;
          this.characters.set(message.playerId, char);
          const map = this.rooms.map((r) => ({
            name: r.name,
            level: r.level,
            position: r.position,
            hasTreasure: r.hasTreasure,
            doors: r.doors,
            uuid: r.uuid,
          }));
          this.channel?.send(JSON.stringify({
            action: "map",
            map,
          }));
          this.sendRoom(char.room.uuid, char.uuid);
          break;
        }
        case "move": {
          const c = this.characters.get(message.playerId)!;
          c.move(message.direction!);
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
          const char = this.characters.get(message.playerId);
          if (!char) break;
          char._score = message.score || 0;
          break;
        }
        case "safe": {
          const char = this.characters.get(message.playerId);
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
          for (let i = 0; i < this.skeletonCount; i++) {
            const skel = this.characters.get("skeleton-" + i)!;
            skel.frozen += 3;
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
        }
      }
    });

    this.channel = this.puppet.getChannel(channelId);
  };

  startGame = () => {
    for (let i = 0; i < this.skeletonCount; i++) {
      const skeleton = new Character("skeleton", this);
      skeleton.uuid = "skeleton-" + i;
      skeleton.game = this;
      skeleton.room = this.grid.get(this.randomSelector())!;
      while (skeleton.room.name === "entrance") {
        skeleton.room = this.grid.get(this.randomSelector())!;
      }
      this.characters.set(skeleton.uuid, skeleton);
      this.sendRoom(skeleton.room.uuid, skeleton.uuid);
    }
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
      for (const [id, char] of this.characters.entries()) {
        if (char.name !== "skeleton" && !char.hasMoved) {
          this.characters.delete(id);
        } else {
          char.hasMoved = false;
        }
      }
      this.channel?.send(JSON.stringify({ action: "unlock" }));
    });
    unlockButton.textContent = "Unlock";

    buttons!.append(unlockButton);

    this.render();
  };

  joinGame = () => {
    this.initDoodler("black", 160);
    this.isHost = false;
    const channelId = "spooky_scary_skeletons";
    this.floor = "lower";
    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case "map": {
          if (!this.rooms.length) {
            this.rooms = message.map!.map((r) => {
              const room = new Room(r, this);
              this.grid.set(
                `${room.position.x},${room.position.y},${room.level}`,
                room,
              );
              return room;
            });
            this.character!.room = this.rooms.find((r) =>
              r.name === "entrance"
            )!;
            this.character!.room.itemChance = 1;
            console.log("initing");
            this.render();
            this.init();
          }
          break;
        }
        case "captured": {
          if (
            this.character?.uuid === message.playerId && !this.character.safe
          ) {
            const event = new CustomEvent("captured");
            dispatchEvent(event);
            this.character.room = this.rooms.find((r) => r.name === "dungeon")!;
            this.dialog?.showModal();
            setTimeout(() => {
              this.dialog?.close();
            }, 2000);
          }
          break;
        }
        case "success": {
          if (
            this.character?.gatheredTreasures.length === 3 &&
            this.character.room?.name === "entrance"
          ) {
            this.dialog!.innerHTML = `
              🎃🎃🎃<br>
              Congratulations! You have collected all of the treasures and escaped to safety!<br>
              🎃🎃🎃
            `;
            this.dialog?.showModal();
            this.channel?.send(JSON.stringify({
              action: "win",
              playerName: this.character.name,
            }));
            this.character.safe = true;
          }
          break;
        }
        case "unlock": {
          this.character!.hasMoved = false;
          this.character?.buttons();
          break;
        }
        case "win": {
          this.character!.hasMoved = true;
          this.dialog!.innerHTML = `
          🎃🎃🎃<br>
          ${message.playerName} has collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
          `;
          this.dialog?.showModal();
          break;
        }
        case "continue": {
          this.character!.hasMoved = false;
          this.character?.buttons();
          this.dialog?.close();
          break;
        }
        case "room": {
          if (
            !this.character ||
            // this.character.room.uuid !== message.roomId ||
            !message.charsInRoom
            // message.playerId === this.character.uuid
          ) break;
          for (const char of message.charsInRoom) {
            const [uuid, name] = char.split(",");
            if (uuid === this.character.uuid) continue;
            const c = this.characters.get(uuid) || new Character(name, this);
            c.uuid = uuid;
            this.characters.set(c.uuid, c);
            c.game = this;
            c.room = this.rooms.find((r) => r.uuid === message.roomId)!;
          }
          break;
        }
        case "trap": {
          const room = this.rooms.find((r) => r.uuid === message.roomId);
          if (this.character?.uuid === message.playerId || !room) break;
          room.trapCount += 1;
          break;
        }
      }
    });

    this.channel = this.puppet.getChannel(channelId);
  };

  initDoodler = (bg: string, additionalHeight = 0) => {
    if (window.doodler) return;
    initializeDoodler(
      {
        height: 32 * 60 + additionalHeight,
        width: 32 * 50,
        canvas: document.querySelector("canvas") as HTMLCanvasElement,
        bg,
        framerate: 5,
      },
      false,
      (ctx) => {
        ctx.imageSmoothingEnabled = false;
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
    this.character = new Character(name, this);
    this.character.game = this;
    this.channel?.send(JSON.stringify({
      action: "join",
      playerId: this.character.uuid,
      playerName: name,
    }));
  };

  channel?: Channel;

  sendMessage(p: socketPacket) {
    this.channel?.send(JSON.stringify(p));
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
    | "score";
  playerId: string;
  playerName?: string;
  roomId?: string;
  charsInRoom?: string[];
  direction?: direction | "up" | "down" | "search";
  map?: Partial<Room>[];
  score?: number;
  safe?: boolean;
}
