const secretTunnel = new Audio();
secretTunnel.src = "./assets/sounds/secrettunnel.mp3";
const musicBox = new Audio();
musicBox.src = "./assets/sounds/musicBox.mp3";
const spookyLaugh1 = new Audio();
spookyLaugh1.src = "./assets/sounds/spookyLaugh1.mp3";
const spookyLaugh2 = new Audio();
spookyLaugh2.src = "./assets/sounds/spookyLaugh2.mp3";
const treasure = new Audio();
treasure.src = "./assets/sounds/treasure.mp3";
const spookyDrone1 = new Audio();
spookyDrone1.src = "./assets/sounds/spookyDrone1.mp3";
const spookyDrone2 = new Audio();
spookyDrone2.src = "./assets/sounds/spookyDrone2.mp3";

export const audioLibrary = {
  secretTunnel,
  musicBox,
  spookyLaugh1,
  spookyLaugh2,
  treasure,
  spookyDrone1,
  spookyDrone2,
};

export function playRandom(...keys: (keyof typeof audioLibrary)[]) {
  audioLibrary[keys[Math.floor(Math.random() * keys.length)]].play();
}
