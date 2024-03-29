import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class Painting extends Item {
  constructor(p: Player, g: Game) {
    super(
      "Suspicious Painting",
      Infinity,
      10,
      p,
      g,
      `
      The sheet falls from the corner of a suspicious painting of a door.
      Looking at it, you get the feeling that you've seen the room before...
      `,
      imageLibrary.painting,
    );
  }

  onPickup(): void {
    super.pickup();
    this.player.seesTunnels = true;
  }

  onDrop(): void {
    this.player.seesTunnels = false;
  }
}
