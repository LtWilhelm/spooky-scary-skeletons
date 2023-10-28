import { Vector } from "doodler";
import { Character, Game, Room } from "./index.ts";

export class Skeleton extends Character {
  frozen = 0;

  targetRoom: Room[] = [];
  targetingTurns = 0;

  constructor(index: number, game: Game) {
    super(
      "skeleton",
      game,
    );

    this.uuid = "skeleton-" + index;
    this.image.src = "./assets/images/skeleton.png";
  }

  navigate() {
    const target =
      this.targetRoom.sort((a, b) =>
        Room.distance(this.room, b, true) - Room.distance(this.room, a, true)
      )[0];
    if (
      target && this.targetingTurns &&
      (!this.path || this.path.at(-1) !== target)
    ) {
      this.path = this.room.findPathTo(target);
      // Remove first step which is always the current room
      this.path?.shift();
    }
    if (this.path && this.path.length && this.targetingTurns) {
      this.room = this.path.shift()!;
      this.targetingTurns--;
      if (!this.targetingTurns || this.room === target) {
        this.path = undefined;
        this.targetRoom = [];
      }
    } else {
      const validSpaces = this.validSpaces;
      const room = this.room.trapCount || this.frozen
        ? this.room
        : this.teleportLocation ||
          validSpaces[Math.floor(Math.random() * validSpaces.length)]![1]!;
      this.room.trapCount && (this.room.trapCount--);
      this.frozen && (this.frozen--);
      this.teleportLocation = undefined;
      this.move("nav", room);
    }
  }

  override render(startPos: Vector): void {
    // super.render(startPos);
    const scale = 3;
    doodler.drawScaled(1 / scale, () => {
      doodler.drawImageWithOutline(
        this.image,
        startPos.copy().add(this.roomPosition).mult(scale),
        { weight: 6, color: "purple" },
      );
    });

    super.renderPath(startPos);
  }
}
