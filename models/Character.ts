import { Vector } from "doodler";
import { Game } from "./Game.ts";
import { direction } from "./index.ts";
import { Room } from "./Room.ts";

export abstract class Character {
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
    if (this.uuid === this.game?.player?.uuid) {
      this.room.known = true;
      if (!this.game?.isHost) {
        this.game!.floor = this._room.level;
      }
    }
  }
  game: Game;

  image: HTMLImageElement;

  teleportLocation?: Room;

  constructor(name: string, game: Game) {
    this.name = name;
    this.uuid = window.crypto.randomUUID();
    this.image = new Image();
    switch (this.name) {
      case "ghost":
        this.image.src = "./assets/images/ghost.png";
        break;
      default:
        this.image.src = "./assets/images/explorer.png";
    }
    this.game = game;
    this.randomizeRoomPosition();
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

  move(dir: "nav", target: Room): void;
  move(dir?: direction | "up" | "down" | "search" | "secret"): void;
  move(
    dir?: direction | "up" | "down" | "search" | "secret" | "nav",
    target?: Room,
  ) {
    this.randomizeRoomPosition();
    if (dir && this.room.trapCount && dir !== "search" && !this.game.isHost) {
      this.room === this.room;
      this.room.trapCount -= 1;
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
      } else if (dir === "secret") {
        this.room = this.room.secretTunnel || this.room;
      } else if (dir === "nav") {
        this.room = target!;
      } else {
        this.room = this.room!.neighbors[dir]!;
      }
    }
    const moveEvent = new CustomEvent("playermove", { detail: this });
    dispatchEvent(moveEvent);
  }

  searchRoom = () => {
  };

  roomPosition!: Vector;
  randomizeRoomPosition() {
    this.roomPosition = new Vector(
      Math.floor(Math.random() * 26),
      Math.floor(Math.random() * 24),
    );
  }

  path?: Room[] | null;

  abstract render(startVec: Vector): void;
  renderPath(pos: Vector) {
    if (this.path && this.game.isHost) {
      const path = this.path;
      doodler.deferDrawing(() => {
        doodler.drawScaled(10, () => {
          let prev = pos.copy().add(16, 16);

          for (
            const step of path
            // const step of path.filter((r) => r.level === this.room.level)
          ) {
            const next = step.getRoomPos().add(
              Room.FloorZ[step.level] * this.game.gridSize.x,
              0,
            ).mult(32)
              .add(
                16,
                16,
              );
            doodler.line(prev, next, { color: "red" });
            prev = next;
          }
        });
      });
    }
  }
  //   if (this.path && this.game.isHost) {
  //     const path = this.path;
  //     doodler.deferDrawing(() => {
  //       doodler.drawScaled(10, () => {
  //         let prev = startVec.copy().add(16, 16);
  //         for (
  //           const step of path.filter((r) => r.level === this.room.level)
  //         ) {
  //           const next = new Vector(step.position.x, step.position.y).mult(32)
  //             .add(
  //               16,
  //               16,
  //             );
  //           doodler.line(prev, next, { color: "red" });
  //           prev = next;
  //         }
  //       });
  //     });
  //   }
  // }
}
