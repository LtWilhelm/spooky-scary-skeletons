import { Vector } from "doodler";
import { Character } from "./Character.ts";
import { Game } from "./Game.ts";
import { direction, directions, floors, Player, rooms } from "./index.ts";
import { imageLibrary } from "../images.ts";
import { Item } from "./items/Item.ts";
import {
  Compass,
  Dice,
  Mirror,
  Quill,
  Skull,
  Spyglass,
  Thread,
} from "./items/index.ts";

type itemLoot = {
  item: new (player: Player, game: Game) => Item;
  type: "item";
  weight: number;
};
type pointLoot = {
  type: "points";
  value: number;
  name: string;
  weight: number;
};

type loot = itemLoot | pointLoot;

export class Room {
  level: floors;
  name: rooms;
  uuid: string;

  trapCount = 0;

  position: { x: number; y: number };

  unique?: boolean;

  game: Game;

  doors: direction[];

  characters: Map<string, Character> = new Map();

  _hasTreasure!: boolean;
  get hasTreasure() {
    return this._hasTreasure;
  }
  set hasTreasure(t: boolean) {
    this._hasTreasure = t;
    this.color = "goldenrod";
  }

  element?: HTMLDivElement;

  known = false;

  color?: string;

  image: HTMLImageElement;
  doorImage: HTMLImageElement;

  itemChance: number;

  secretTunnel?: Room;
  secretTunnelId?: string;

  constructor(r: Partial<Room>, g: Game) {
    this.level = r.level!;
    this.name = r.name!;
    this.hasTreasure = r.hasTreasure || false;
    this.doors = r.doors || [];

    this.position = r.position!;

    this.uuid = r.uuid || window.crypto.randomUUID();
    this.image = new Image(32, 32);
    this.doorImage = new Image(32, 32);

    this.game = g;

    // this.itemChance = Math.max(0, Math.random() - .5);
    this.itemChance = 1;

    this.doorImage = this.level === "basement"
      ? imageLibrary.basementDoor
      : imageLibrary.door;

    switch (this.name) {
      case "hallway":
        this.image = this.level !== "basement"
          ? imageLibrary.hallway
          : imageLibrary.basementHallway;
        this.doorImage = this.level !== "basement"
          ? imageLibrary.hallwayDoor
          : imageLibrary.basementHallwayDoor;
        break;
      case "dining room":
        this.image = imageLibrary.diningRoom;
        break;
      case "bedroom":
        this.image = imageLibrary.bedroom;
        break;
      case "parlor":
        this.image = imageLibrary.parlor;
        break;
      case "library":
        this.image = imageLibrary.library;
        break;
      case "cellar":
        this.image = imageLibrary.cellar;
        break;
      case "catacomb":
        this.image = imageLibrary.catacombs;
        break;
      case "alcoves":
        this.image = imageLibrary.alcoves;
        break;
      case "dungeon":
        this.image = imageLibrary.dungeon;
        break;
      case "entrance":
        this.image = imageLibrary.entrance;
        break;
      case "stairs":
        switch (this.level) {
          case "upper":
            this.image = imageLibrary.upperStairs;
            break;
          case "lower":
            this.image = imageLibrary.lowerStairs;
            break;
          case "basement":
            this.image = imageLibrary.basementStairs;
            break;
        }
        this.doorImage = this.level !== "basement"
          ? imageLibrary.stairsDoor
          : imageLibrary.basementStairsDoor;
        break;
      case "study":
        this.image = imageLibrary.study;
        break;
      case "game room":
        this.image = imageLibrary.gameRoom;
        break;
    }
    this.rotation = this.name === "entrance"
      ? 0
      : (2 * Math.PI) * (Math.floor(Math.random() * 4) / 4);
  }

  get neighbors(): {
    north?: Room;
    south?: Room;
    east?: Room;
    west?: Room;
  } {
    return {
      north: this.game?.grid.get(
        `${this.position.x},${this.position.y - 1},${this.level}`,
      ),
      south: this.game?.grid.get(
        `${this.position.x},${this.position.y + 1},${this.level}`,
      ),
      east: this.game?.grid.get(
        `${this.position.x + 1},${this.position.y},${this.level}`,
      ),
      west: this.game?.grid.get(
        `${this.position.x - 1},${this.position.y},${this.level}`,
      ),
    };
  }

  generateDoors = () => {
    // if (this.name === 'stairs' || this.name === 'hallway' || this.name === 'entrance') {
    //   this.neighbors.north?.doors.push("south");
    //   this.neighbors.west?.doors.push("east");
    //   this.doors.push('north', 'east', 'south', 'west');
    //   this.position.x === 0 && (this.doors = this.doors.filter(d => d !== 'west'));
    //   this.position.x === this.game!.gridSize.x - 1 && (this.doors = this.doors.filter(d => d !== 'east'));
    //   this.position.y === 0 && (this.doors = this.doors.filter(d => d !== 'north'));
    //   this.position.y === this.game!.gridSize.y - 1 && (this.doors = this.doors.filter(d => d !== 'south'));
    //   return;
    // }

    if (this.neighbors.north?.doors.includes("south")) this.doors.push("north");

    if (this.neighbors.west?.doors.includes("east")) this.doors.push("west");

    if (
      this.position.y !== this.game!.gridSize.y - 1 &&
      Math.random() > this.doors.length / 5
    ) this.doors.push("south");
    if (
      this.position.x !== this.game!.gridSize.x - 1 &&
      Math.random() > this.doors.length / 5
    ) this.doors.push("east");
    if (this.doors.length === 0 || (this.doors.length === 1)) {
      let randomDoor =
        directions[Math.floor(Math.random() * directions.length)];
      tryAdd:
      while (this.doors.length === 0) {
        randomDoor = directions[Math.floor(Math.random() * directions.length)];
        // if (this.doors.includes(randomDoor))
        switch (randomDoor) {
          case "east": {
            if (this.position.x === this.game!.gridSize.x - 1) continue tryAdd;
            this.neighbors.east?.doors.push("west");
            break;
          }
          case "west": {
            if (this.position.x === 0) continue tryAdd;
            this.neighbors.west?.doors.push("east");
            break;
          }
          case "north": {
            if (this.position.y === 0) continue tryAdd;
            this.neighbors.north?.doors.push("south");
            break;
          }
          case "south": {
            if (this.position.y === this.game!.gridSize.y - 1) continue tryAdd;
            this.neighbors.south?.doors.push("north");
            break;
          }
        }
        this.doors.push(randomDoor);
      }
    }

    this.doors = Array.from(new Set(this.doors));
  };

  get accessor() {
    return `${this.position.x},${this.position.y},${this.level}`;
  }

  get lootTable(): loot[] {
    switch (this.name) {
      // case "hallway":
      // case "stairs":
      // case "dining room":
      // case "bedroom":
      // case "parlor":
      // case "library":
      // case "cellar":
      // case "dungeon":
      case "entrance":
        return [
          {
            item: Mirror,
            type: "item",
            weight: 1,
          },
        ];
        // case "catacomb":
        // case "alcoves":
    }
    return [{
      type: "points",
      name: "Golden Banana",
      value: 20,
      weight: 1,
    }];
  }

  hasBeenSearched = false;

  get tunnelMessage() {
    switch (this.name) {
      case "library":
        return "You try to pull a book off of a shelf, but it catches on something and the whole bookcase swings to reveal a passageway.";
      default:
        return "A hidden door! I wonder where it leads?";
    }
  }
  tunnelKnown = false;
  search() {
    this.hasBeenSearched = true;
    if (this.secretTunnel && !this.tunnelKnown) {
      this.tunnelKnown = true;
      this.secretTunnel.tunnelKnown = true;
      this.game.alert(this.tunnelMessage, 5000);
    } else if (Math.random() < this.itemChance) {
      const loots = [];
      for (const loot of this.lootTable) {
        for (let i = 0; i < loot.weight; i++) {
          loots.push(loot);
        }
      }

      const loot = loots[Math.floor(Math.random() * loots.length)];

      switch (loot.type) {
        case "points": {
          this.game.player?.addPoints(loot.value, true);
          const prev = this.game.dialog.innerHTML;
          this.game.dialog.innerHTML =
            `You found ${loot.name} worth ${loot.value} points!`;
          this.game.dialog.showModal();
          setTimeout(() => {
            this.game.dialog.close();
            this.game.dialog.innerHTML = prev || "";
          }, 3000);
          break;
        }
        case "item":
          new loot.item(this.game.player!, this.game);
          break;
      }
    }
    this.game.player?.move("search");
    this.game.render();
  }

  rotation: number;

  drawTreasure(pos: Vector) {
    doodler.drawScaled(.5, () => {
      doodler.drawImage(
        imageLibrary.treasure,
        pos.add(20, 20).mult(2),
      );
    });
  }

  getRoomPos() {
    return new Vector(this.position.x, this.position.y);
  }

  render(offset = new Vector(0, 0)) {
    const startPos = new Vector(
      this.position.x + offset.x,
      this.position.y,
    ).mult(32);

    if (this.known || this.game.isHost) {
      doodler.drawRotated(startPos.copy().add(16, 16), this.rotation, () => {
        doodler.drawImage(this.image, startPos);
      });
      for (const door of this.doors) {
        let angle = 0;
        switch (door) {
          case "south":
            angle = Math.PI;
            break;
          case "east":
            angle = Math.PI / 2;
            break;
          case "west":
            angle = (2 * Math.PI) * (3 / 4);
            break;
        }
        doodler.drawRotated(startPos.copy().add(16, 16), angle, () => {
          doodler.drawImage(this.doorImage, startPos);
        });
      }
    }

    if (
      this.game?.isHost ||
      (this.game?.player && this.characters.get(this.game.player.uuid))
    ) {
      for (const char of this.characters.values()) {
        char.render(startPos);
      }
    }

    if (
      this.hasTreasure &&
      (this.game.isHost || this.known ||
        this.game.player?.knownTreasures.includes(this))
    ) {
      this.drawTreasure(startPos.copy());
    }

    if (
      this.position.x === 0 && this.level !== "basement" &&
      this.name !== "hallway"
    ) {
      doodler.drawImage(
        imageLibrary.window,
        startPos,
      );
    }

    if (
      this.game.player?.vision &&
      this.characters.size
    ) {
      const roomPos = this.getRoomPos().mult(32);
      const player = this.game.player;

      const distance = this.calculateDistanceToRoom(player.room);
      if (
        distance < player.vision && player.room !== this
      ) {
        const renderables = ["skeleton", "ghost"].filter((r) =>
          player.visionIncludesAllMonsters || r === "skeleton"
        );
        for (const char of this.characters.values()) {
          if (!renderables.includes(char.name)) continue;
          doodler.deferDrawing(() => {
            doodler.drawScaled(10, () => {
              char.render(roomPos);
            });
          });
        }
      }
    }

    if (
      this.game?.player?.sight &&
      this.characters.get(this.game.player.uuid)
    ) {
      for (const door of this.doors) {
        let room = this.neighbors[door];
        while (
          room &&
          this.calculateDistanceToRoom(room) < this.game.player.sight + 1
        ) {
          const r = room;
          const roomPos = new Vector(r.position.x, r.position.y);
          if (this.game.isHost) {
            roomPos.add(Room.FloorZ[r.level] * 32 * this.game.gridSize.x, 0);
          }

          doodler.deferDrawing(() => {
            doodler.drawScaled(10, () => {
              if (r.hasTreasure) r.drawTreasure(roomPos.copy());
              for (const char of r.characters.values()) {
                char.render(roomPos);
              }
            });
          });
          if (room.doors.includes(door)) room = room.neighbors[door];
          else room = undefined;
        }
      }
    }

    if (
      this.trapCount && (this.game.isHost || this.game.player?.canSeeTraps)
    ) {
      const point = startPos.copy().add(
        2,
        22,
      );
      doodler.drawScaled(.5, () => {
        doodler.drawImage(imageLibrary.trap, point.mult(2));
      });
    }

    if (
      (this.game.isHost ||
        (this.known && this.tunnelKnown) ||
        this.game.player?.seesTunnels) && this.secretTunnel
    ) {
      doodler.drawScaled(.5, () => {
        doodler.drawImageWithOutline(
          imageLibrary.tunnel,
          startPos.copy().mult(2).add(3, 3),
          { weight: 6, color: "white" },
        );
      });
    }

    if (
      this.game.player?.seesTunnels && this.secretTunnel
    ) {
      for (const char of this.characters.values()) {
        doodler.deferDrawing(() => {
          doodler.drawScaled(10, () => {
            char.render(startPos);
          });
        });
      }
    }
  }

  private calculateDistanceToRoom(room: Room) {
    const thisVec = new Vector(this.position.x, this.position.y);
    const roomVec = new Vector(room.position.x, room.position.y);
    return thisVec.dist(roomVec);
  }

  findPathTo(
    targetRoom: Room,
    includeDiagonal = false,
    includeSecretTunnel = false,
  ): Room[] | null {
    // A* algorithm implementation
    const openSet: Room[] = [this];
    const cameFrom: { [key: string]: Room | null } = {};
    const gScore: { [key: string]: number } = { [this.getKey()]: 0 };
    const fScore: { [key: string]: number } = {
      [this.getKey()]: this.heuristic(targetRoom, includeDiagonal),
    };

    while (openSet.length > 0) {
      const current = this.getMinFScoreRoom(openSet, fScore);

      if (current === targetRoom) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(openSet.indexOf(current), 1);

      const neighbors = current.getNeighbors(
        includeDiagonal,
        includeSecretTunnel,
      );
      for (const neighbor of neighbors) {
        const tentativeGScore = gScore[current.getKey()] +
          this.distance(current, neighbor, includeDiagonal);

        if (
          !gScore[neighbor.getKey()] ||
          tentativeGScore < gScore[neighbor.getKey()]
        ) {
          cameFrom[neighbor.getKey()] = current;
          gScore[neighbor.getKey()] = tentativeGScore;
          fScore[neighbor.getKey()] = tentativeGScore +
            neighbor.heuristic(targetRoom, includeDiagonal);

          if (openSet.indexOf(neighbor) === -1) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return null; // No path found
  }

  private getNeighbors(
    includeDiagonal: boolean,
    includeSecretTunnel: boolean,
  ): Room[] {
    const neighbors: Room[] = [];
    for (const door of this.doors) {
      const neighbor = this.neighbors[door];
      if (!neighbor) continue;
      neighbors.push(neighbor);
      if (includeDiagonal) {
        let doors: direction[];
        switch (door) {
          case "north":
          case "south":
            doors = ["east", "west"];
            break;
          case "east":
          case "west":
            doors = ["north", "south"];
            break;
        }

        doors = doors.filter((d) => neighbor.doors.includes(d));

        for (const door of doors) {
          const diagonal = neighbor.neighbors[door];
          if (!diagonal) continue;
          neighbors.push(diagonal);
        }
      }
    }
    if (this.name === "stairs") {
      let stairs = this.game.rooms.filter((r) => r.name === "stairs");
      switch (this.level) {
        case "upper":
        case "basement":
          stairs = stairs.filter((s) => s.level === "lower");
          break;
        case "lower":
          stairs = stairs.filter((s) => s.level !== "lower");
          break;
      }
      neighbors.push(...stairs);
    }
    if (includeSecretTunnel && this.secretTunnel && this.tunnelKnown) {
      neighbors.push(this.secretTunnel);
    }
    return Array.from(new Set(neighbors));
  }

  private getMinFScoreRoom(
    openSet: Room[],
    fScore: { [key: string]: number },
  ): Room {
    // Find the room in openSet with the minimum fScore
    let minRoom = openSet[0];
    for (const room of openSet) {
      if (fScore[room.getKey()] < fScore[minRoom.getKey()]) {
        minRoom = room;
      }
    }
    return minRoom;
  }

  private reconstructPath(
    cameFrom: { [key: string]: Room | null },
    current: Room,
  ): Room[] {
    // Reconstruct the path from the cameFrom dictionary
    const path: Room[] = [current];
    while (cameFrom[current.getKey()] && current !== this) {
      current = cameFrom[current.getKey()]!;
      path.unshift(current);
    }
    return path;
  }

  private distance(room1: Room, room2: Room, includeDiagonal: boolean): number {
    if (room1.name === "stairs" && room2.name === "stairs") return 1;

    return includeDiagonal
      ? new Vector(room1.position.x, room1.position.y, Room.FloorZ[room1.level])
        .dist(
          new Vector(
            room2.position.x,
            room2.position.y,
            Room.FloorZ[room2.level],
          ),
        )
      : Math.abs(room1.position.x - room2.position.x) +
        Math.abs(room1.position.y - room2.position.y) +
        Math.abs(Room.FloorZ[room1.level] - Room.FloorZ[room1.level]);
  }

  static FloorZ: Record<floors, number> = {
    basement: 0,
    lower: 1,
    upper: 2,
  };

  private heuristic(targetRoom: Room, includeDiagonal: boolean): number {
    // Placeholder for heuristic calculation, replace with actual logic
    return targetRoom.level === this.level
      ? this.distance(this, targetRoom, includeDiagonal)
      : this.distance(this, this.game.stairs[this.level], includeDiagonal);
  }

  private getKey(): string {
    return `${this.position.x}-${this.position.y}-${Room.FloorZ[this.level]}`;
  }
}
