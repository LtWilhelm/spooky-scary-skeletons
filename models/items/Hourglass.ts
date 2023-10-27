import { imageLibrary } from "../../images.ts";
import { Character, Game } from "../index.ts";
import { Item } from "./Item.ts";

export class Hourglass extends Item {
  constructor(p: Character, g: Game) {
    super(
      "Bone-sand Hourglass",
      2,
      30,
      p,
      g,
      `
      The sound of sand draws your attention to an hourglass.
      The irregular, bone-colored sand seems to last just long enough for you to move between rooms.
      Highlights nearby skeletons while held and for 5 turns after using.
      `,
      imageLibrary.hourglass,
    );
  }

  sandDrops = 5;

  handleMove = (e: CustomEvent) => {
    if ((e.detail === this.player) && !this.sandDrops--) this.onDrop();
  };

  onPickup(): void {
    super.onPickup();
    this.player.vision = 1;
  }
  onDrop(): void {
    this.player.vision = 0;
  }

  use(): boolean {
    if (!this.uses) return false;

    this.game.sendMessage({
      action: "freeze",
      playerId: this.player.uuid,
    });

    if (this.uses === 1) {
      addEventListener("playermove" as any, this.handleMove);
    }

    return super.use();
  }

  get usable(): boolean {
    return !!this.uses;
  }
}
