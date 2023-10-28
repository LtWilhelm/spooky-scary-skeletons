import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class MusicBox extends Item {
  onPickup(): void {
    super.pickup();
  }
  onDrop(): void {
  }
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

  get usable(): boolean {
    return !!this.uses;
  }

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

    return super.use();
  }
}
