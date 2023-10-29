import { Vector } from "doodler";
import { imageLibrary } from "../../images.ts";
import { Game, Player, Room } from "../index.ts";
import { Item } from "./Item.ts";

export class Compass extends Item {
  path?: Room[] | null;
  constructor(p: Player, g: Game) {
    super(
      "Spectral Compass",
      3,
      50,
      p,
      g,
      `
      The glint of this ghostly compass catches your eye.
      The needle flickers in and out of existence. It seems to point to your desires!
      `,
      imageLibrary.compass,
    );
  }

  handler = () => {
    const floor = this.player.room.level;
    const target =
      this.player.gatheredTreasures.includes(this.game.treasureRooms[floor])
        ? this.game.stairs[floor]
        : this.game.treasureRooms[floor];
    this.path = this.player.room.findPathTo(target, false, true);

    for (const char of this.player.room.characters.values()) {
      if (char.name === "skeleton") {
        this.use();
        if (this.uses < 1) {
          this.onDrop();
          this.player.item = undefined;
        }
      }
    }
  };

  onPickup(): void {
    this.player.safe = true;
    this.player.vision = 1;
    addEventListener("playermove", this.handler);
    addEventListener("captured", this.handler);
    this.handler();
    super.pickup();
  }
  onDrop(): void {
    removeEventListener("playermove", this.handler);
    removeEventListener("captured", this.handler);
    this.player.safe = false;
    this.player.vision = 0;
  }

  render(): void {
    super.render();
    if (this.path) {
      const center = new Vector(0, this.game.gridSize.y).mult(32).add(8, 7);
      const [current, next] = this.path;
      if (!current || !next) return;
      const dir = new Vector(next.position.x, next.position.y).sub(
        current.position.x,
        current.position.y,
      );
      dir.setMag(4);
      doodler.line(center, center.copy().add(dir), {
        color: "black",
        // weight: .8,
      });
    }
  }
}
