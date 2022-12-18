import { Game } from "./Game.ts";
import { direction } from "./index.ts";
import { Room } from "./Room.ts";

export class Character {
  name: string;
  uuid: string;

  room?: Room;
  game?: Game;

  hasMoved = true;

  gatheredTreasures: string[] = []

  constructor(name: string) {
    this.name = name;
    this.uuid = window.crypto.randomUUID();
  }

  get validSpaces(): [(direction | 'up' | 'down'), Room | undefined][] {
    const spaces: [(direction | 'up' | 'down'), Room | undefined][] = this.room!.doors.map(d => [d, this.room?.neighbors[d]])

    if (this.room?.name === 'stairs') {
      const currentLevel = this.room!.level;
      const options = {
        up: {
          basement: 'lower',
          lower: 'upper',
          upper: 'asdf',
        },
        down: {
          upper: 'lower',
          lower: 'basement',
          basement: 'asdf',
        },
      }
      const up = this.game?.rooms.find(r => r.name === 'stairs' && r.level === options['up'][currentLevel]);
      const down = this.game?.rooms.find(r => r.name === 'stairs' && r.level === options['down'][currentLevel]);
      spaces.push(['up', up]);
      spaces.push(['down', down]);
    }

    return spaces.filter(s => !!s[1]);
  }

  init = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('button.movement');
    buttons.forEach(b => b.addEventListener('click', (e) => {
      const dir = (e.target as HTMLButtonElement).dataset.dir;
      this.move(dir as direction);
    }))
  }

  buttons = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('button.movement');
    const validSpaces = this.validSpaces;
    buttons.forEach(b => {
      const dir = b.dataset.dir;
      const room = validSpaces?.find(s => s[0] === dir);
      if (room) {
        b.disabled = false;
      } else {
        b.disabled = true;
      }

      if (dir === 'up' && this.room?.name === 'stairs' && (this.room.level === 'basement' || this.room.level === 'lower')) {
        b.disabled = false;
      }
      if (dir === 'down' && this.room?.name === 'stairs' && (this.room.level === 'upper' || this.room.level === 'lower')) {
        b.disabled = false;
      }

      if (this.hasMoved) b.disabled = true;
    });
  }

  move = (dir?: direction | 'up' | 'down') => {
    if (dir) {
      this.hasMoved = true;
      this.room?.element?.classList.remove('current');
      if (dir === 'up' || dir === 'down') {
        const currentLevel = this.room!.level;
        const options = {
          up: {
            basement: 'lower',
            upper: 'upper',
            lower: 'upper'
          },
          down: {
            upper: 'lower',
            lower: 'basement',
            basement: 'basement'
          },
        }
        this.room = this.game?.rooms.find(r => r.name === 'stairs' && r.level === options[dir as 'up' | 'down'][currentLevel]);
      } else {
        this.room = this.room!.neighbors[dir];
      }
      this.room!.known = true;
      if (this.room?.hasTreasure && !this.gatheredTreasures.includes(this.room.accessor)) {
        this.gatheredTreasures.push(this.room.accessor);
      }
      if (!this.game?.isHost && this.gatheredTreasures.length === 3 && this.room?.name === 'entrance') {
        this.game!.dialog!.innerHTML = `
          🎄🎄🎄<br>
          Congratulations! You have collected all of the presents and escaped to safety!<br>
          🎄🎄🎄
        `
        this.game?.dialog?.showModal();
        this.game?.channel?.send(JSON.stringify({
          action: 'win',
          playerName: this.name
        }));
      }
      this.game?.render();
      !this.game?.isHost && this.game?.channel?.send(JSON.stringify({
        action: 'move',
        playerId: this.uuid,
        direction: dir
      }))
    } else {
      const validSpaces = this.validSpaces;
      this.room = validSpaces[Math.floor(Math.random() * validSpaces.length)]![1]
    }
  }
}
