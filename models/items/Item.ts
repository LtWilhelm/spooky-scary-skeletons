import { Vector } from "https://git.cyborggrizzly.com/emma/doodler/raw/tag/0.0.9d/geometry/vector.ts";
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
    public img: HTMLImageElement,
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
    this.game.dialog.prepend(this.img);
    const close = () => {
      this.game.dialog?.close();
      this.game.dialog!.innerHTML = prev || "";
    };
    const takeBtn = document.createElement("button");
    takeBtn.addEventListener("click", () => {
      this.onPickup();
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

  onPickup() {
    this.player.item?.onDrop();
    this.player.item = this;
  }

  onDrop() {}

  render() {
    const start = new Vector(0, this.game.gridSize.y).mult(32).add(2, 2);
    doodler.fillSquare(start, 12, { fillColor: "#00000050" });
    doodler.drawImage(this.img, start.copy().add(1, 1), 10, 10);
    doodler.fillText(this.name, start.copy().add(15, 8), 48, {
      fillColor: "white",
      textBaseline: "middle",
    });
  }
}
