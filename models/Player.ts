import { Vector } from "doodler";
import { Character, direction } from "./index.ts";
import { Room } from "./Room.ts";
import { Item } from "./items/Item.ts";
import { audioLibrary } from "../sounds.ts";

export class Player extends Character {
  gatheredTreasures: Room[] = [];
  knownTreasures: Room[] = [];
  hasMoved = true;
  item?: Item;

  seesTunnels = false;
  vision = 0;
  sight = 0;
  visionIncludesAllMonsters = false;
  canSeeTraps = false;

  _safe = false;
  get safe() {
    return this._safe;
  }
  set safe(s: boolean) {
    this._safe = s;
    if (!this.game?.isHost) {
      this.game!.channel?.send(JSON.stringify({
        playerId: this.uuid,
        action: "safe",
        safe: this._safe,
      }));
    }
  }

  hasWon = false;

  _score = 0;
  get score() {
    return this._score;
  }
  addPoints(s: number, doubleable?: boolean) {
    this._score = Math.max(0, this._score + s);
    if (doubleable) {
      dispatchEvent(new CustomEvent<number>("score", { detail: s }));
    }
    this.game.sendMessage({
      action: "score",
      score: this.score,
      playerId: this.uuid,
    });
  }
  init = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      "button.movement",
    );
    buttons.forEach((b) =>
      b.addEventListener("click", (e) => {
        const dir = (e.target as HTMLButtonElement).dataset.dir;
        switch (dir) {
          case "c":
            this.room.search();
            break;
          case "b":
            this.item?.use();
            break;
          case "d": {
            this.move("secret");
            audioLibrary.secretTunnel.play();
            break;
          }

          default:
            this.move(dir as direction);
        }
      })
    );
  };

  buttons = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      "button.movement",
    );
    const validSpaces = this.validSpaces;
    buttons.forEach((b) => {
      const dir = b.dataset.dir;
      const room = validSpaces?.find((s) => s[0] === dir);
      if (room) {
        b.disabled = false;
      } else {
        b.disabled = true;
      }

      if (
        dir === "up" && this.room?.name === "stairs" &&
        (this.room.level === "basement" || this.room.level === "lower")
      ) {
        b.disabled = false;
      }
      if (
        dir === "down" && this.room?.name === "stairs" &&
        (this.room.level === "upper" || this.room.level === "lower")
      ) {
        b.disabled = false;
      }

      if (dir === "c" && !this.room.hasBeenSearched && !this.hasWon) {
        b.disabled = false;
        b.textContent = this.room.itemChance > 0
          ? `Search ${Math.floor(this.room.itemChance * 100)}%`
          : "Search";
      }
      if (dir === "b" && this.item?.usable) {
        b.disabled = false;
      }
      if (dir === "d" && this.room.tunnelKnown) {
        b.classList.remove("hidden");
        b.disabled = false;
      }

      if (this.hasMoved) {
        switch (dir) {
          case "d":
            b.classList.add("hidden");
            break;

          default:
            b.disabled = true;
        }
      }
    });
  };

  move(dir: "nav", target: Room): void;
  move(dir: direction | "up" | "down" | "search" | "secret"): void;
  move(
    dir: direction | "up" | "down" | "nav" | "search" | "secret",
    target?: Room | undefined,
  ): void {
    if (dir === "search") {
      this.game.sendMessage({
        action: "noise",
        playerId: this.uuid,
      });
    }
    this.hasMoved = true;
    dir === "nav" ? super.move(dir, target!) : super.move(dir);
    this.game?.render();
    this.game.sendMessage({
      action: "move",
      playerId: this.uuid,
      direction: dir,
      roomId: this.room.uuid,
    });

    if (
      this.room?.hasTreasure &&
      !this.gatheredTreasures.includes(this.room)
    ) {
      this.gatheredTreasures.push(this.room);
      audioLibrary.treasure.play();
      this.addPoints(50);
    }

    this.game!.floor = this.room?.level || this.game!.floor;
  }

  render(startPos: Vector): void {
    const scale = 2;
    doodler.drawWithAlpha(this.safe ? .25 : 1, () => {
      doodler.drawScaled(1 / scale, () => {
        this.game?.player === this
          ? doodler.drawImageWithOutline(
            this.image,
            startPos.copy().add(this.roomPosition).mult(scale),
            { color: "lime", weight: 6 },
          )
          : doodler.drawImage(
            this.image,
            startPos.copy().add(this.roomPosition).mult(scale),
          );
      });
    });
    doodler.deferDrawing(() => {
      doodler.drawScaled(10 / scale, () => {
        const name = this.uuid === this.game?.player?.uuid ? "" : this.name;
        doodler.fillText(
          name,
          startPos.copy().add(this.roomPosition).add(4, 12).mult(scale),
          40,
          { color: "lime", textAlign: "center" },
        );
      });
    });
  }
}
