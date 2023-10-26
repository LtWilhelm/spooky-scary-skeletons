import { imageLibrary } from "../../images.ts";
import { Character, Game } from "../index.ts";
import { Item } from "./Item.ts";

export class Skull extends Item {
  constructor(
    player: Character,
    game: Game,
  ) {
    super(
      "Skull",
      1,
      10,
      player,
      game,
      `You found a skull!<br>
      Protects you from skeletons, but they're not likely to fall for it more than once!<br>
      Let's you see skeletons in neighboring rooms.`,
      imageLibrary.skull,
    );
  }

  onPickup(): void {
    this.player.item?.onDrop();
    this.player.item = this;
    this.player.safe = true;
    this.player.vision = 1;
  }

  onDrop(): void {
    this.player.safe = false;
    this.player.vision = 0;
  }

  use(): boolean {
    if (!super.use()) return false;
    !this.uses &&
      (this.player.safe = false);
    return true;
  }
}
