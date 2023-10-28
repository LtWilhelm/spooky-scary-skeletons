import { imageLibrary } from "../../images.ts";
import { Character, Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class Mirror extends Item {
  constructor(player: Player, game: Game) {
    super(
      "Mirror",
      1,
      30,
      player,
      game,
      `
      A Haunted Mirror!<br>
      Peering through it reveals all monsters
      `,
      imageLibrary.mirror,
    );

    this.addEventListener("captured", () => {
      this.onDrop();
      this.player.item = undefined;
    });
  }

  onPickup(): void {
    super.onPickup();
    this.player.vision = 10;
    this.player.visionIncludesAllMonsters = true;
  }
  onDrop(): void {
    this.player.vision = 0;
    this.player.visionIncludesAllMonsters = false;
  }
}
