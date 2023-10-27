import { imageLibrary } from "../../images.ts";
import { Character, Game } from "../index.ts";
import { Item } from "./Item.ts";

export class Dice extends Item {
  constructor(p: Character, g: Game) {
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
    console.log("scord doubled", e.detail);
    this.player.addPoints(e.detail);
    this.game.sendMessage({
      action: "dice",
      playerId: this.player.uuid,
    });
  };

  onPickup(): void {
    addEventListener("score" as any, this.handler);
  }

  onDrop(): void {
    removeEventListener("score" as any, this.handler);
  }
}