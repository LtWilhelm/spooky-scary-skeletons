import { Vector } from "doodler";
import { Character } from "./Character.ts";
import { Game } from "./Game.ts";
import { direction, directions, floors, rooms } from "./index.ts";

export class Room {
  level: floors;
  name: rooms;
  uuid?: string;

  position: { x: number; y: number };

  unique?: boolean;

  game?: Game;

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
    this.doorImage.src = this.level === "basement"
      ? "./assets/images/rooms/basement door.png"
      : "./assets/images/rooms/door.png";

    switch (this.name) {
      case "hallway":
        this.image.src = this.level !== "basement"
          ? "./assets/images/rooms/hallway/hallway.png"
          : "./assets/images/rooms/hallway/basement hallway.png";
        this.doorImage.src = this.level !== "basement"
          ? "./assets/images/rooms/hallway/hallway door.png"
          : "./assets/images/rooms/hallway/basement hallway door.png";
        break;
      case "dining room":
        this.image.src = "./assets/images/rooms/dining room.png";
        break;
      case "bedroom":
        this.image.src = "./assets/images/rooms/bedroom.png";
        break;
      case "parlor":
        this.image.src = "./assets/images/rooms/parlor.png";
        break;
      case "library":
        this.image.src = "./assets/images/rooms/library.png";
        break;
      case "cellar":
        this.image.src = "./assets/images/rooms/cellar.png";
        break;
      case "catacomb":
        this.image.src = "./assets/images/rooms/catacombs.png";
        break;
      case "alcoves":
        this.image.src = "./assets/images/rooms/alcoves.png";
        break;
      case "dungeon":
        this.image.src = "./assets/images/rooms/dungeon.png";
        break;
      case "entrance":
        this.image.src = "./assets/images/rooms/entrance.png";
        break;
      case "stairs":
        this.image.src = `./assets/images/rooms/stair/${this.level} stairs.png`;
        this.doorImage.src = this.level !== "basement"
          ? "./assets/images/rooms/stair/stairs door.png"
          : "./assets/images/rooms/stair/basement stairs door.png";
        this.color = "purple";
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

  get lootTable(): { name: string; type: "points" | "item"; value?: number }[] {
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
      case "catacomb":
      case "alcoves":
    }
    return [];
  }

  rotation: number;

  render() {
    const startPos = new Vector(
      this.position.x * 32,
      this.position.y * 32,
    );

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

    if (
      this.game?.isHost ||
      (this.game?.character && this.characters.get(this.game.character.uuid))
    ) {
      for (const char of this.characters.values()) {
        char.render();
      }
    }
  }
}
