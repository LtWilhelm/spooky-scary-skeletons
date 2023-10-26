import { Vector } from "doodler";
import { Game } from "./Game.ts";
import { direction } from "./index.ts";
import { Room } from "./Room.ts";
import { Item } from "./items/Item.ts";

export class Character {
  name: string;
  uuid: string;

  _room!: Room;
  get room() {
    return this._room;
  }
  set room(r: Room) {
    this._room?.characters.delete(this.uuid);
    this._room = r;
    this._room.characters.set(this.uuid, this);
    if (this.uuid === this.game?.character?.uuid) {
      this.room.known = true;
      if (!this.game?.isHost) {
        this.game!.floor = this._room.level;
      }
    }
  }
  game: Game;

  hasMoved = true;

  gatheredTreasures: string[] = [];
  knownTreasures: Room[] = [];

  score = 0;
  image: HTMLImageElement;

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
  visionIncludesAllMonsters = false;
  vision = 0;
  sight = 0;

  item?: Item;

  constructor(name: string, game: Game) {
    this.name = name;
    this.uuid = window.crypto.randomUUID();
    this.image = new Image();
    switch (this.name) {
      case "skeleton":
        this.image.src = "./assets/images/skeleton.png";
        break;
      case "ghost":
        this.image.src = "./assets/images/ghost.png";
        break;
      default:
        this.image.src = "./assets/images/explorer.png";
    }
    this.game = game;
    this.roomPosition = new Vector(
      Math.floor(Math.random() * 26),
      Math.floor(Math.random() * 24),
    );
  }

  get validSpaces(): [(direction | "up" | "down"), Room | undefined][] {
    const spaces: [(direction | "up" | "down"), Room | undefined][] = this.room!
      .doors.map((d) => [d, this.room?.neighbors[d]]);

    if (this.room?.name === "stairs") {
      const currentLevel = this.room!.level;
      const options = {
        up: {
          basement: "lower",
          lower: "upper",
          upper: "asdf",
        },
        down: {
          upper: "lower",
          lower: "basement",
          basement: "asdf",
        },
      };
      const up = this.game?.rooms.find((r) =>
        r.name === "stairs" && r.level === options["up"][currentLevel]
      );
      const down = this.game?.rooms.find((r) =>
        r.name === "stairs" && r.level === options["down"][currentLevel]
      );
      spaces.push(["up", up]);
      spaces.push(["down", down]);
    }

    return spaces.filter((s) => !!s[1]);
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

      if (dir === "c" && !this.room.hasBeenSearched) {
        b.disabled = false;
      }
      if (dir === "b" && this.item?.usable) {
        b.disabled = false;
      }

      if (this.hasMoved) b.disabled = true;
    });
  };

  // This is going to need a massive overhaul when the ghost AI is added
  move = (dir?: direction | "up" | "down" | "search") => {
    this.roomPosition = new Vector(
      Math.floor(Math.random() * 26),
      Math.floor(Math.random() * 24),
    );
    if (dir && this.room.trapCount && dir !== "search" && !this.game.isHost) {
      this.room === this.room;
      this.room.trapCount -= 1;
      this.hasMoved = true;
      const prev = this.game?.dialog?.innerHTML;
      this.game.dialog!.innerHTML =
        "AAAARRRGH! A BUNCH OF SPIDERS HAVE YOU TRAPPED!";
      this.game.dialog?.showModal();
      setTimeout(() => {
        this.game.dialog?.close();
        this.game.dialog!.innerHTML = prev || "";
      }, 3000);
      !this.game.isHost && this.game.sendMessage({
        action: "move",
        playerId: this.uuid,
        direction: "search",
        playerName: this.name,
      });
      this.game.render();
    } else if (dir) {
      this.hasMoved = true;
      this.room?.element?.classList.remove("current");
      if (dir === "up" || dir === "down") {
        const currentLevel = this.room!.level;
        const options = {
          up: {
            basement: "lower",
            upper: "upper",
            lower: "upper",
          },
          down: {
            upper: "lower",
            lower: "basement",
            basement: "basement",
          },
        };
        this.room = this.game?.rooms.find((r) =>
          r.name === "stairs" &&
          r.level === options[dir as "up" | "down"][currentLevel]
        )!;
      } else if (dir === "search") {
        this.room === this.room;
      } else {
        this.room = this.room!.neighbors[dir]!;
      }
      if (
        this.room?.hasTreasure &&
        !this.gatheredTreasures.includes(this.room.accessor)
      ) {
        this.gatheredTreasures.push(this.room.accessor);
      }

      this.game?.render();
      !this.game?.isHost && this.game?.channel?.send(JSON.stringify({
        action: "move",
        playerId: this.uuid,
        direction: dir,
      }));
      this.game!.floor = this.room?.level || this.game!.floor;
    } else {
      const validSpaces = this.validSpaces;
      this.room = this.room.trapCount
        ? this.room
        : validSpaces[Math.floor(Math.random() * validSpaces.length)]![1]!;
      this.room.trapCount && (this.room.trapCount -= 1);
    }
  };

  searchRoom = () => {
  };

  roomPosition: Vector;

  render() {
    if (!this.room) return;
    const startPos = new Vector(
      this.room.position.x * 32,
      this.room.position.y * 32,
    );

    let scale = 2;

    switch (this.name) {
      case "skeleton":
        scale = 3;
        break;
    }

    if (this.name !== "skeleton" && this.name !== "ghost") {
      doodler.drawWithAlpha(this.safe ? .25 : 1, () => {
        doodler.drawScaled(1 / scale, () => {
          this.game?.character === this
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
          const name = this.uuid === this.game?.character?.uuid
            ? ""
            : this.name;
          // doodler.strokeText(
          //   name,
          //   startPos.copy().add(this.roomPosition).add(4, 12).mult(scale),
          //   40,
          //   { strokeColor: "white", textAlign: "center" },
          // );
          doodler.fillText(
            name,
            startPos.copy().add(this.roomPosition).add(4, 12).mult(scale),
            40,
            { color: "lime", textAlign: "center" },
          );
        });
      });
    } else {
      doodler.drawScaled(1 / scale, () => {
        doodler.drawImageWithOutline(
          this.image,
          startPos.copy().add(this.roomPosition).mult(scale),
          { weight: 4, color: "purple" },
        );
      });
    }
  }
}
