import { Character, Game } from "../index.ts";

type gameEvents = "captured" | "nearby";

export class Item {
  get usable() {
    return false;
  }

  constructor(
    public name: string,
    public uses: number,
    public points: number,
    public player: Character,
    public game: Game,
    public pickupDescription: string,
  ) {
    this.onFind();
  }

  /**
   * @description add a listener to a game event to use the item when fired, includes a custom handler that will run if the item is used successfully
   * @param event
   * @param handler Only runs if the item is successfully used
   */
  addEventListener(event: gameEvents, handler?: (e: Event) => void) {
    // this is going to be leaky, but probably won't be a problem
    addEventListener(event, (e) => {
      if (this.use()) {
        handler?.(e);
      }
    });
  }

  use(): boolean {
    if (!this.uses) return false;
    this.uses--;
    this.player.move("search");
    return true;
  }

  private onFind() {
    const prev = this.game.dialog?.innerHTML;
    this.game.dialog!.innerHTML = this.pickupDescription.replace(
      /(<br>)?\r?\n/g,
      "<br>",
    );
    const close = () => {
      this.game.dialog?.close();
      this.game.dialog!.innerHTML = prev || "";
    };
    const takeBtn = document.createElement("button");
    takeBtn.addEventListener("click", () => {
      this.player.item?.onDrop();
      this.player.item = this;
      this.player.item.onPickup();
      this.game.render();
      close();
    });
    takeBtn.textContent = "Take";
    const leaveBtn = document.createElement("button");
    leaveBtn.addEventListener("click", () => {
      close();
    });
    leaveBtn.textContent = "Leave";
    this.game.dialog?.append(document.createElement("br"), takeBtn, leaveBtn);

    this.game.dialog?.showModal();
  }

  onPickup() {}

  onDrop() {}
}
