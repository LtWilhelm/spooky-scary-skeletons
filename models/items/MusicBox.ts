import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class MusicBox extends Item {
  turns = 0;
  constructor(p: Player, g: Game) {
    super(
      "Creepy Music Box",
      3,
      25,
      p,
      g,
      `
      A haunting tune catches your attention.
      Perhaps you could use this to distract skeletons?
      `,
      imageLibrary.musicBox,
    );
  }
  onPickup(): void {
    super.pickup();
  }
  onDrop(): void {
  }
  get usable(): boolean {
    return !!this.uses;
  }

  handler = () => {
    this.turns--;
    if (!this.turns) {
      for (const skelly of this.game.skeletons) {
        skelly.path = undefined;
      }
    }
  };

  use(): boolean {
    if (!this.uses) {
      this.player.item = undefined;
      return false;
    }
    this.game.sendMessage({
      action: "music",
      roomId: this.player.room.uuid,
      playerId: this.player.uuid,
    });

    this.turns = 5;
    for (const skelly of this.game.skeletons) {
      skelly.path = skelly.room.findPathTo(this.player.room);
    }

    addEventListener("playermove", this.handler);

    return super.use();
  }

  render(): void {
    super.render();

    for (const skelly of this.game.skeletons) {
      if (skelly.path) {
        const path = skelly.path.filter((r) =>
          r.level === this.player.room.level
        );
        doodler.deferDrawing(() => {
          doodler.drawScaled(10, () => {
            // let prev = skelly.room.getRoomPos().mult(32).add(16, 16);
            let prev;

            for (
              const [i, step] of path.entries()
              // const step of path.filter((r) => r.level === this.room.level)
            ) {
              const next = step.getRoomPos().mult(32)
                .add(
                  16,
                  16,
                );
              if (!prev) {
                prev = next;
                continue;
              }

              doodler.line(prev!, next, { color: "aqua" });
              prev = next;
            }
          });
        });
      }
    }
  }
}
