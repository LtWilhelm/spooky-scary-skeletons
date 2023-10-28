import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class Spyglass extends Item {
  constructor(player: Player, game: Game) {
    super(
      "Spyglass",
      Infinity,
      5,
      player,
      game,
      `
      You found a spyglass!
      This let's you see monsters and players through doors across the map
      `,
      imageLibrary.spyglass,
    );
  }

  onPickup(): void {
    super.pickup();
    this.player.sight = 6;
  }

  onDrop(): void {
    this.player.sight = 0;
  }
}
