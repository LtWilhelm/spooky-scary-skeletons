import { Character } from "./Character.ts";
import { Game } from "./Game.ts";
import { direction, directions, floors, rooms } from "./index.ts";

export class Room {
  level: floors;
  name: rooms;
  uuid?: string;

  position: { x: number, y: number };

  unique?: boolean;

  game?: Game;

  doors: direction[];

  characters: Character[] = [];

  hasTreasure: boolean;

  element?: HTMLDivElement;

  known = false;

  constructor(r: Partial<Room>, g: Game) {
    this.level = r.level!;
    this.name = r.name!;
    this.hasTreasure = r.hasTreasure || false;
    this.doors = r.doors || [];

    this.position = r.position!;

    this.uuid = window.crypto.randomUUID();

    this.game = g;
  }

  get neighbors(): {
    north?: Room
    south?: Room
    east?: Room
    west?: Room
  } {
    return {
      north: this.game?.grid.get(`${this.position.x},${this.position.y - 1},${this.level}`),
      south: this.game?.grid.get(`${this.position.x},${this.position.y + 1},${this.level}`),
      east: this.game?.grid.get(`${this.position.x + 1},${this.position.y},${this.level}`),
      west: this.game?.grid.get(`${this.position.x - 1},${this.position.y},${this.level}`),
    }
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

    if (this.neighbors.north?.doors.includes('south')) this.doors.push('north');

    if (this.neighbors.west?.doors.includes('east')) this.doors.push('west');

    if (this.position.y !== this.game!.gridSize.y - 1 && Math.random() > this.doors.length / 5) this.doors.push('south');
    if (this.position.x !== this.game!.gridSize.x - 1 && Math.random() > this.doors.length / 5) this.doors.push('east');
    if (this.doors.length === 0 || (this.doors.length === 1)) {
      let randomDoor = directions[Math.floor(Math.random() * directions.length)];
      tryAdd:
      while (this.doors.length === 0) {
        randomDoor = directions[Math.floor(Math.random() * directions.length)];
        // if (this.doors.includes(randomDoor))
        switch (randomDoor) {
          case 'east': {
            if (this.position.x === this.game!.gridSize.x - 1) continue tryAdd;
            this.neighbors.east?.doors.push('west');
            break;
          }
          case 'west': {
            if (this.position.x === 0) continue tryAdd;
            this.neighbors.west?.doors.push('east');
            break;
          }
          case 'north': {
            if (this.position.y === 0) continue tryAdd;
            this.neighbors.north?.doors.push('south');
            break;
          }
          case 'south': {
            if (this.position.y === this.game!.gridSize.y - 1) continue tryAdd;
            this.neighbors.south?.doors.push('north');
            break;
          }
        }
        this.doors.push(randomDoor)
      }
    }

    this.doors = Array.from(new Set(this.doors));
  }

  get accessor() {
    return `${this.position.x},${this.position.y},${this.level}`
  }
}
