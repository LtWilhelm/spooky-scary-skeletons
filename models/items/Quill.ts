import { imageLibrary } from "../../images.ts";
import { Game, Player } from "../index.ts";
import { Item } from "./Item.ts";

export class Quill extends Item {
  onPickup(): void {
    super.pickup();
  }
  onDrop(): void {
  }
  constructor(p: Player, g: Game) {
    super(
      "Ethereal Quill",
      1,
      30,
      p,
      g,
      `
      A ghostly quill floats above the desk.
      Maybe you could use it draw a door?
      `,
      imageLibrary.quill,
    );
  }

  get usable(): boolean {
    return !!this.uses && !this.player.room.secretTunnel;
  }

  use(): boolean {
    if (!super.use()) return false;

    while (!this.player.room.secretTunnel) {
      const room = this.game.grid.get(
        this.game.randomSelector(this.player.room.level),
      )!;
      if (!room.secretTunnel) {
        room.secretTunnel = this.player.room;
        this.player.room.secretTunnel = room;
      }
    }
    this.player.room.tunnelKnown = true;
    this.player.room.secretTunnel.tunnelKnown = true;

    this.player.item = undefined;

    return true;
  }
}
