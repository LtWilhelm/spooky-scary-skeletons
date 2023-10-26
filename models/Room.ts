import { Vector } from "doodler";
import { Character } from "./Character.ts";
import { Game } from "./Game.ts";
import { direction, directions, floors, rooms } from "./index.ts";
import { imageLibrary } from "../images.ts";
import { Item } from "./items/Item.ts";
import { Mirror, Skull, Spyglass } from "./items/index.ts";
import { CrystalBall } from "./items/CrystalBall.ts";

type itemLoot = {
  item: new (player: Character, game: Game) => Item;
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

    this.itemChance = Math.max(0, Math.random() - .5);

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
      case "hallway":
      case "stairs":
      case "dining room":
      case "bedroom":
      case "parlor":
      case "library":
      case "cellar":
      case "dungeon":
      case "entrance":
        return [
          {
            item: CrystalBall,
            type: "item",
            weight: 1,
          },
        ];
      case "catacomb":
      case "alcoves":
    }
    return [];
  }

  hasBeenSearched = false;

  search() {
    this.hasBeenSearched = true;
    if (Math.random() < this.itemChance) {
      const loots = [];
      for (const loot of this.lootTable) {
        for (let i = 0; i < loot.weight; i++) {
          loots.push(loot);
        }
      }

      const loot = loots[Math.floor(Math.random() * loots.length)];

      switch (loot.type) {
        case "points":
          // todo: handle scoring
          break;
        case "item":
          new loot.item(this.game.character!, this.game);
          break;
      }
    }
    this.game.character?.move("search");
    this.game.render();
  }

  rotation: number;

  drawTreasure() {
    doodler.drawScaled(.5, () => {
      doodler.drawImage(
        imageLibrary.treasure,
        new Vector(this.position.x * 32, this.position.y * 32).add(20, 20)
          .mult(
            2,
          ),
      );
    });
  }

  render() {
    const startPos = new Vector(
      this.position.x * 32,
      this.position.y * 32,
    );

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
      (this.game?.character && this.characters.get(this.game.character.uuid))
    ) {
      for (const char of this.characters.values()) {
        char.render();
      }
    }

    if (
      this.hasTreasure &&
      (this.game.isHost || this.known ||
        this.game.character?.knownTreasures.includes(this))
    ) {
      this.drawTreasure();
    }

    if (
      this.position.x === 0 && this.level !== "basement" &&
      this.name !== "hallway"
    ) {
      doodler.drawImage(
        imageLibrary.window,
        new Vector(0, this.position.y * 32),
      );
    }

    if (
      this.game?.character?.vision &&
      this.characters.get(this.game.character.uuid)
    ) {
      const rooms = this.game.rooms.filter((r) =>
        r.level === this.level &&
        this.calculateDistanceToRoom(r) <
          (this.game?.character?.vision || 0) + 1
      );
      const player = this.game.character;
      const renderables = ["skeleton", "ghost"].filter((r) =>
        player.visionIncludesAllMonsters || r === "skeleton"
      );
      for (const room of rooms) {
        if (room === this) continue;
        for (const char of room.characters.values()) {
          if (!renderables.includes(char.name)) continue;
          doodler.deferDrawing(() => {
            doodler.drawScaled(10, () => {
              char.render();
            });
          });
        }
      }
    }

    if (
      this.game?.character?.sight &&
      this.characters.get(this.game.character.uuid)
    ) {
      for (const door of this.doors) {
        let room = this.neighbors[door];
        while (
          room &&
          this.calculateDistanceToRoom(room) < this.game.character.sight + 1
        ) {
          const r = room;
          doodler.deferDrawing(() => {
            doodler.drawScaled(10, () => {
              if (r.hasTreasure) r.drawTreasure();
              for (const char of r.characters.values()) {
                char.render();
              }
            });
          });
          if (room.doors.includes(door)) room = room.neighbors[door];
          else room = undefined;
        }
      }
    }
  }

  private calculateDistanceToRoom(room: Room) {
    const thisVec = new Vector(this.position.x, this.position.y);
    const roomVec = new Vector(room.position.x, room.position.y);
    return thisVec.dist(roomVec);
  }
}
