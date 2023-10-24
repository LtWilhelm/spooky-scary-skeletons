import { Character } from "./Character.ts";
import { direction, directions, Room } from "./index.ts";

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
  _target: Character | null = null;
  _lastKnownLocation: Room | null = null;
  set target(target: Character) {
    this._target = target;
    this._lastKnownLocation = target.room!;
  }

  seenScore = 0;

  constructor() {
    super("ghost");
  }

  // Horrible and unoptimized method to check if the target is in LOS by looking in each direction from the current room
  look() {
    let lastRoom = this.room!;
    peer:
    for (const dir of directions) {
      if (!lastRoom.doors.includes(dir)) continue;

      let found = false;
      // seek:
      while (!found) {
        const neighbor = lastRoom.neighbors[dir];
        if (!neighbor || !neighbor.doors.includes(dir)) {
          lastRoom = this.room!;
          continue peer;
        }
        if (lastRoom === this._lastKnownLocation) {
          found = true;
          this._lastKnownLocation = lastRoom;
          this.seenScore = 5;
          break peer;
        } else {
          lastRoom = lastRoom.neighbors[dir]!;
        }
      }
    }
  }

  move = (dir?: direction | "up" | "down" | undefined) => {
    super.move(dir);
    if (this.seenScore < 1) this.look();
  };

  closedList = [];

  // TODO: implement A*
  // navigate(): direction | "up" | "down" {

  // }
}
