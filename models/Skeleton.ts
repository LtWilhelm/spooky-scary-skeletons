import { Vector } from "doodler";
import { Character, Game } from "./index.ts";

export class Skeleton extends Character {
  frozen = 0;

  constructor(index: number, game: Game) {
    super(
      "skeleton",
      game,
    );

    this.uuid = "skeleton-" + index;
    this.image.src = "./assets/images/skeleton.png";
  }

  navigate() {
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
  }
}
