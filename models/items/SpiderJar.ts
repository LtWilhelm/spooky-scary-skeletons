import { Character, Game } from "../index.ts";
import { Item } from "./Item.ts";

export class SpiderJar extends Item {
  constructor(player: Character, game: Game) {
    super(
      "Spider Jar",
      1,
      15,
      player,
      game,
      `
      Ew, a jar full of spiders!
      Might be useful to slow down your opponents...
      `,
    );
  }

  get usable(): boolean {
    return this.uses > 0;
  }

  use(): boolean {
    if (!this.uses) return false;

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const prev = this.game.dialog?.innerHTML;
    const close = () => {
      this.game.dialog?.close();
      this.game.dialog!.innerHTML = prev || "";
    };

    for (const door of this.player.room.doors) {
      const room = this.player.room.neighbors[door];
      if (!room) continue;
      const button = document.createElement("button");
      button.dataset.dir = door;
      button.textContent = door;
      button.addEventListener("click", () => {
        this.game.sendMessage({
          action: "trap",
          roomId: room.uuid,
          playerId: this.player.uuid,
          playerName: this.player.name,
        });
        this.uses--;
        this.onDrop();
        this.player.item = undefined;
        this.player.move("search");

        close();
      });
      buttons.append(button);
    }
    const button = document.createElement("button");
    button.dataset.dir = "c";
    button.textContent = "Here";
    button.addEventListener("click", () => {
      this.game.sendMessage({
        action: "trap",
        roomId: this.player.room.uuid,
        playerId: this.player.uuid,
        playerName: this.player.name,
      });
      this.uses--;
      this.onDrop();
      this.player.item = undefined;
      this.player.move("search");

      close();
    });
    buttons.append(button);
    const cancel = document.createElement("button");
    cancel.dataset.dir = "b";
    cancel.textContent = "Nevermind...";
    cancel.addEventListener("click", () => {
      close();
    });
    buttons.append(cancel);

    this.game.dialog.innerHTML =
      "Which way would you like to throw the jar of spiders?";
    this.game.dialog.append(buttons);

    this.game.dialog.showModal();

    return true;
  }
}
