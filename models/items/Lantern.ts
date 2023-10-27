import { imageLibrary } from "../../images.ts";
import { Character, Game } from "../index.ts";
import { Item } from "./Item.ts";

export class Lantern extends Item {
  constructor(p: Character, g: Game) {
    super(
      "Spectral Lantern",
      Infinity,
      15,
      p,
      g,
      `
      A strange blue lantern catches your eye.
      The cobwebs in the corners of the room glow brightly when you pick it up.
      `,
      imageLibrary.lantern,
    );
  }

  onPickup(): void {
    super.onPickup();
    this.player.canSeeTraps = true;
  }

  onDrop(): void {
    this.player.canSeeTraps = false;
  }
}
