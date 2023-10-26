import { Character, Game, Room } from "../index.ts";
import { Item } from "./Item.ts";

export class CrystalBall extends Item {
  constructor(player: Character, game: Game) {
    super(
      "Cyrstal Ball",
      1,
      30,
      player,
      game,
      `
      The glint of a Crystal Ball catches your eye.<br>
      The mist within swirls with visions of treasure!<br>
      Can be used once to find the treasure on the current floor.
      `,
    );

    this.usable;
  }

  private levelTreasure?: Room;

  get usable() {
    this.levelTreasure = this.game.rooms.filter((r) =>
      r.level === this.game.floor
    ).find((r) => r._hasTreasure);
    return !!(this.levelTreasure &&
      !this.player.knownTreasures.includes(this.levelTreasure) &&
      this.uses > 0);
  }

  use(): boolean {
    if (!super.use() || !this.levelTreasure) return false;
    this.player.knownTreasures.push(this.levelTreasure);
    return true;
  }
}
