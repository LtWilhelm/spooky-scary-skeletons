import { Vector } from "doodler";
import { Character, Game, Room } from "./index.ts";

export class Skeleton extends Character {
  frozen = 0;

  targetRoom?: Room;
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
    if (this.targetRoom && this.targetingTurns && !this.path) {
      this.path = this.room.findPathTo(this.targetRoom);
      // Remove first step which is always the current room
      this.path?.shift();
    }
    if (this.path && this.path.length && this.targetingTurns) {
      this.room = this.path.shift()!;
      this.targetingTurns--;
      if (!this.targetingTurns) this.path = undefined;
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

    if (this.path && this.game.isHost) {
      const path = this.path;
      doodler.deferDrawing(() => {
        doodler.drawScaled(10, () => {
          let prev = startPos.copy().add(16, 16);

          for (
            const step of path
            // const step of path.filter((r) => r.level === this.room.level)
          ) {
            const next = step.getRoomPos().add(
              Room.FloorZ[step.level] * this.game.gridSize.x,
              0,
            ).mult(32)
              .add(
                16,
                16,
              );
            doodler.line(prev, next, { color: "red" });
            prev = next;
          }
        });
      });
    }
  }
}
