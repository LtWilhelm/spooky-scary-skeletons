import { Game } from "./models/index.ts";
import * as _ from "./models/items/index.ts";

const game = new Game();

const init = () => {
  const buttonContainer = document.querySelector(".buttons");
  if (buttonContainer) {
    const hostButton = document.createElement("button");
    hostButton.textContent = "Host";
    hostButton.dataset.dir = "west";
    hostButton.addEventListener("click", host);
    const joinButton = document.createElement("button");
    joinButton.textContent = "Join";
    joinButton.dataset.dir = "east";
    joinButton.addEventListener("click", join);
    buttonContainer.append(hostButton, joinButton);
  }
};

const join = () => {
  game.joinGame();
  const name = prompt("What name would you like to use?") || "Treasure Hunter";

  game.createCharacter(name);

  document.querySelector(".buttons")!.innerHTML = `
  <button class="movement" data-dir="north">North</button>
  <button class="movement" data-dir="south">South</button>
  <button class="movement" data-dir="east">East</button>
  <button class="movement" data-dir="west">West</button>
  <button class="movement" data-dir="up">Up</button>
  <button class="movement" data-dir="down">Down</button>
  <button class="movement" data-dir="c">Search</button>
  <button class="movement" data-dir="b">Use Item</button>
  `;
};

const host = () => {
  game.hostGame();

  const container = document.querySelector(".buttons");
  if (container) {
    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.dataset.dir = "north";
    startButton.addEventListener("click", game.startGame);

    const upButton = document.createElement("button");
    upButton.textContent = "Up";
    upButton.dataset.dir = "up";
    upButton.addEventListener("click", () => game.changeFloor("up"));
    const downButton = document.createElement("button");
    downButton.textContent = "Down";
    downButton.dataset.dir = "down";
    downButton.addEventListener("click", () => game.changeFloor("down"));

    container.append(startButton, upButton, downButton);
  }
};

init();
