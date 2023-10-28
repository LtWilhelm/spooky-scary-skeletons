import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class Dice extends Item {
  constructor(p: Player, g: Game) {
    super(
      "Cursed Dice",
      Infinity,
      0,
      p,
      g,
      `
      The dice on the gaming table glow a sinister red.
      Are you feeling lucky?
      `,
      imageLibrary.dice,
    );
  }

  handler = (e: CustomEvent<number>) => {
    this.player.addPoints(e.detail);
    this.game.sendMessage({
      action: "dice",
      playerId: this.player.uuid,
    });
  };

  onPickup(): void {
    super.onPickup();
    addEventListener("score" as any, this.handler);
  }

  onDrop(): void {
    removeEventListener("score" as any, this.handler);
  }
}
