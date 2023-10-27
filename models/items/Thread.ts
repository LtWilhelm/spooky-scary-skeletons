import { Vector } from "doodler";
import { imageLibrary } from "../../images.ts";
import { Character, Game, Room } from "../index.ts";
import { Item } from "./Item.ts";

export class Thread extends Item {
  path?: Room[] | null;
  constructor(p: Character, g: Game) {
    super(
      "Spool of Thread",
      Infinity,
      10,
      p,
      g,
      `
      Someone dropped a spool of thread.
      It looks like one end was tied to something in a different room. Maybe you could follow it?
      `,
      imageLibrary.thread,
    );
  }

  handler = () => {
    const entrance = this.game.rooms.find((r) => r.name === "entrance")!;
    this.path = this.player.room.findPathTo(entrance, false, true);
  };

  onPickup(): void {
    super.onPickup();
    addEventListener("playermove", this.handler);
    addEventListener("captured", this.handler);
    this.handler();
  }
  onDrop(): void {
    removeEventListener("playermove", this.handler);
    removeEventListener("captured", this.handler);
  }
  render(): void {
    super.render();
    if (this.path) {
      const path = this.path;
      doodler.deferDrawing(() => {
        doodler.drawScaled(10, () => {
          let prev = new Vector(
            this.player.room.position.x,
            this.player.room.position.y,
          )
            .mult(
              32,
            ).add(16, 16);
          for (
            const step of path.filter((r) => r.level === this.player.room.level)
          ) {
            const next = new Vector(step.position.x, step.position.y).mult(32)
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
