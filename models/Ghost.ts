import { Vector } from "https://git.cyborggrizzly.com/emma/doodler/raw/tag/0.1.0a/mod.ts";
import { Character } from "./Character.ts";
import { Game, Room } from "./index.ts";

/*
The ghost is a special monster that targets a specific player based off of the noise they've made
- Players have a chance of making noise when they enter a room that they haven't explored yet
- Players have a chance of making noise when they search a room
- Players are guaranteed to make noise when they pick up a treasure
- The ghost hunts by moving towards the last known location of the player, looking in every line of sight each step it takes
- Unlike other monsters, the ghost can move diagonally, assuming that the doors between the current room and the diagonal room are open
- When the ghost sees its target, it will be able to track it for 5 moves, regardless of line of sight
- When the ghost reaches its target, it will take away 10 points and then be teleported to a random room, where it will start wandering until a new target is selected.
*/
export class Ghost extends Character {
  seenScore = 0;

  noises: Map<string, number> = new Map();

  _target: Character | null = null;
  _lastKnownLocation: Room | null = null;
  set target(target: Character | null) {
    this._target = target;
    if (target) {
      this._lastKnownLocation = target.room!;
    }
  }
  get target() {
    return this._target;
  }

  constructor(game: Game) {
    super("ghost", game);
    this.uuid = "ghost";
    this.room = this.game.grid.get(this.game.randomSelector())!;
  }

  look() {
    if (!this.target) return;
    peer:
    for (const door of this.room.doors) {
      let neighbor = this.room.neighbors[door];

      while (neighbor) {
        if (neighbor.characters.get(this.target.uuid)) {
          this._lastKnownLocation = this.target.room;
          this.seenScore = 5;
          break peer;
        }
        neighbor = neighbor.neighbors[door];
      }
    }
  }

  navigate() {
    this.priority();
    if (this.target) {
      this.look();
      const target = this.seenScore > 0
        ? this.target.room
        : this._lastKnownLocation;

      this._lastKnownLocation = target;

      this.seenScore--;

      if (target && target !== this.path?.at(-1)) {
        this.path = this.room.findPathTo(target, true, true);
        this.path?.shift();
      }

      if (this.path) {
        const step = this.path.shift();
        step && this.move("nav", step);
      }
    } else {
      const room = this.game.grid.get(this.game.randomSelector())!;
      this.move("nav", room);
    }

    this.look();
    if (this.room === this.target?.room) {
      this.game.sendMessage({
        action: "ghosted",
        playerId: this.target.uuid,
      });
      this.noises.set(this.target.uuid, 0);
      this._target = null;
      this._lastKnownLocation = null;
    } else if (this.room === this._lastKnownLocation) {
      this._target = null;
      this._lastKnownLocation = null;
    }
  }

  noiseThreshold = 36;

  hear(playerId: string) {
    const score = this.noises.get(playerId) || 0;
    this.noises.set(playerId, score + Math.floor(Math.random() * 4));
  }

  priority() {
    let loudest = "";
    for (const [id, noise] of this.noises.entries()) {
      const highest = this.noises.get(loudest) || this.noiseThreshold;
      if (noise > highest) loudest = id;
    }
    if (loudest) {
      const char = this.game.players.get(loudest);
      if (!char || this.target) return;
      this.target = char;
      this._lastKnownLocation = this.target.room;
    }
  }

  render(startPos: Vector): void {
    const scale = 1.5;
    doodler.drawScaled(1 / scale, () => {
      doodler.drawImage(
        this.image,
        startPos.copy().add(this.roomPosition).mult(scale),
      );
    });
    super.renderPath(startPos);
  }
}
