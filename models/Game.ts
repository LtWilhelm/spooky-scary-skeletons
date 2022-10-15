import { Character } from "./Character.ts";
import { direction, floors, gridAccessor, rooms } from "./index.ts";
import { Room } from "./Room.ts";

import { Sockpuppet } from "https://deno.land/x/sockpuppet@Alpha0.5.2/client/mod.ts";
import { Channel } from "https://deno.land/x/sockpuppet@Alpha0.5.2/client/Channel.ts";

export class Game {
  rooms: Room[] = [];
  characters: Map<string, Character> = new Map();

  gridSize = { x: 4, y: 5 };

  grid: Map<gridAccessor, Room> = new Map();

  entrance = { x: 0, y: 0 };

  isHost = false;

  character?: Character;

  skeletonCount = 0;

  dialog = document.querySelector('dialog');

  tick = () => {
    this.skeletonCheck();
    this.skeletonMove();
    this.render();
  }

  generate = () => {
    const floors: floors[] = ['basement', 'lower', 'upper'];
    this.grid = new Map();
    this.rooms = [];
    for (const floor of floors) {
      const stairX = Math.floor(Math.random() * this.gridSize.x);
      const stairY = Math.floor(Math.random() * this.gridSize.y);
      const stairs = new Room({
        name: 'stairs',
        position: { x: stairX, y: stairY },
        level: floor,
      }, this);

      this.grid.set(`${stairX},${stairY},${floor}`, stairs)

      if (floor === 'basement') {
        let dungeonX = Math.floor(Math.random() * this.gridSize.x);
        let dungeonY = Math.floor(Math.random() * this.gridSize.y);
        const dungeon = new Room({
          name: 'dungeon',
          position: { x: dungeonX, y: dungeonY },
          level: floor,
        }, this);

        while (this.grid.get(`${dungeonX},${dungeonY},${floor}`)) {
          dungeonX = Math.floor(Math.random() * this.gridSize.x);
          dungeonY = Math.floor(Math.random() * this.gridSize.y);
        }

        this.grid.set(`${dungeonX},${dungeonY},${floor}`, dungeon);
      }

      if (floor === 'lower') {
        let entranceX = Math.floor(Math.random() * this.gridSize.x);
        let entranceY = 4;
        const entrance = new Room({
          name: 'entrance',
          position: { x: entranceX, y: entranceY },
          level: floor,
        }, this);

        entrance.known = true;

        while (this.grid.get(`${entranceX},${entranceY},${floor}`)) {
          entranceX = Math.floor(Math.random() * this.gridSize.x);
          entranceY = Math.floor(Math.random() * this.gridSize.y);
        }

        this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
        this.entrance = {
          x: entranceX,
          y: entranceY
        }
      }

      for (let x = 0; x < this.gridSize.x; x++) {
        for (let y = 0; y < this.gridSize.y; y++) {
          if (!this.grid.get(`${x},${y},${floor}`)) {
            const validRooms = rooms.filter(r => r.floors.includes(floor));

            const selectedRoom = validRooms[Math.floor(Math.random() * validRooms.length)];
            const room = new Room({
              name: selectedRoom.name,
              level: floor,
              position: { x, y }
            }, this);

            this.grid.set(`${x},${y},${floor}`, room);
          }
        }
      }
    }

    for (const floor of floors) {
      for (let x = 0; x < this.gridSize.x; x++) {
        for (let y = 0; y < this.gridSize.y; y++) {
          const room = this.grid.get(`${x},${y},${floor}`);
          room?.generateDoors();
        }
      }

      const bannedRooms: rooms[] = ['hallway', 'stairs', "entrance"]
      let treasureRoom = this.grid.get(this.randomSelector(floor));
      while (!treasureRoom?.doors.length || bannedRooms.includes(treasureRoom.name)) {
        treasureRoom = this.grid.get(this.randomSelector(floor));
      }
      treasureRoom.hasTreasure = true;
    }

    for (let i = 0; i < this.skeletonCount; i++) {
      const skeleton = new Character('skeleton');
      skeleton.room = this.grid.get(this.randomSelector());
      this.characters.set(skeleton.uuid, skeleton);
      // skeleton.room?.characters.push(skeleton);
    }

    for (const room of this.grid.values()) this.rooms.push(room);
  }

  init = () => {
    const rooms = Array.from(this.grid.values()).sort((a) => {
      if (a.level === 'basement') return -1
      if (a.level === 'lower') return 0
      if (a.level === 'upper') return 1
      return 0;
    }).sort((a, b) => {
      const posA = a.position;
      const posB = b.position;

      return posA.x - posB.x;
    }).sort((a, b) => {
      const posA = a.position;
      const posB = b.position;

      return posA.y - posB.y;
    })

    document.querySelectorAll('.floor').forEach(f => f.innerHTML = '');

    for (const room of rooms) {
      const floor = document.querySelector(`.floor#${room.level}`);
      const div = document.createElement('div');
      // div.textContent = `${room.name}, ${room.position.x}, ${room.position.y}`;
      div.textContent = room.name;
      div.classList.add(...room.doors);
      div.classList.add('hidden');
      for (const character of this.characters.values()) {
        if (character.room === room) div.textContent += ' 💀'
      }
      if (room.hasTreasure) div.classList.add('treasure');
      floor?.append(div);
      room.element = div;
    }

    this.character?.init();

    this.render();
  }

  render = () => {
    const rooms = this.rooms;

    for (const room of rooms) {
      if (!this.isHost && !room.known) room.element?.classList.add('hidden');
      else room.element?.classList.remove('hidden');
      if (this.character?.room === room) {
        room.element?.classList.add('current');
      }
    }

    if (!this.isHost) {
      document.querySelectorAll<HTMLDivElement>('.floor[data-floor]').forEach(f => {
        const floor = f.dataset.floor;

        if (floor === this.character?.room?.level) {
          f.classList.remove('hidden');
        } else {
          f.classList.add('hidden');
        }
      })

      const nameDict = {
        lower: 'Ground Floor',
        upper: 'Upstairs',
        basement: 'Basement'
      }
      
      document.querySelector('.floor-name')!.textContent = nameDict[this.character!.room!.level];
      document.querySelector('.score')!.textContent = `You have gathered ${this.character?.gatheredTreasures.length} treasures`;
    }

    if (this.isHost) {
      for (const character of this.characters.values()) {
        if (character.name !== 'skeleton') {
          character.room?.element?.classList.add('current');
          character.room!.element!.textContent = character.room!.name;
        }
        else
          character.room!.element!.textContent = character.room!.name + ' 💀';

      }
    }
    this.character?.buttons();
  }

  randomSelector = (floor?: floors): gridAccessor => `${Math.floor(Math.random() * this.gridSize.x)},${Math.floor(Math.random() * this.gridSize.y)},${floor || floors[Math.floor(Math.random() * floors.length)]}`;

  skeletonCheck = () => {
    const characters = Array.from(this.characters.values());
    const skeletons = characters.filter(c => c.name === "skeleton");

    for (const character of characters) {
      if (character.name !== 'skeleton') {
        for (const skeleton of skeletons) {
          if (character.room === skeleton.room) {
            character.room?.element?.classList.remove('current');
            character.room = this.rooms.find(r => r.name === 'dungeon');
            this.channel?.send(JSON.stringify({
              action: 'captured',
              playerId: character.uuid
            }))
            this.render();
          }
        }
      }
    }
  }

  skeletonMove = () => {
    const characters = Array.from(this.characters.values());
    const skeletons = characters.filter(c => c.name === "skeleton");

    for (const skeleton of skeletons) {
      skeleton.move();
    }
    this.skeletonCheck();
  }

  checkPlayerMoves = () => {
    const characters = Array.from(this.characters.values()).filter(c => c.name !== "skeleton");
    if (characters.every(c => c.hasMoved)) {
      this.tick();
      setTimeout(() => {
        characters.forEach(c => c.hasMoved = false);
        this.channel?.send(JSON.stringify({
          action: 'unlock'
        }));
      }, 2000);
    }
  }

  puppet = new Sockpuppet('wss://skirmish.ursadesign.io');

  hostGame = async () => {
    this.isHost = true;
    this.generate();
    this.init();
    const channelId = 'spooky_scary_skeletons';
    await this.puppet.createChannel(channelId);

    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case 'join': {
          const char = new Character(message.playerName)
          char.room = this.rooms.find(r => r.name === 'entrance');
          char.game = this;
          char.uuid = message.playerId;
          this.characters.set(message.playerId, char);
          const map = this.rooms.map(r => ({
            name: r.name,
            level: r.level,
            position: r.position,
            hasTreasure: r.hasTreasure,
            doors: r.doors
          }));

          this.channel?.send(JSON.stringify({
            action: 'map',
            map
          }));
          this.render();
          break;
        }
        case 'move': {
          this.characters.get(message.playerId)?.move(message.direction!);
          this.checkPlayerMoves();
          break;
        }
      }
    })

    this.channel = this.puppet.getChannel(channelId);
  }

  startGame = () => {
    this.channel?.send(JSON.stringify({action: 'unlock'}));
    document.querySelector('.buttons')!.innerHTML = '';
  }

  joinGame = () => {
    this.isHost = false;
    const channelId = 'spooky_scary_skeletons';
    this.puppet.joinChannel(channelId, (msg) => {
      const message = JSON.parse(msg) as socketPacket;

      switch (message.action) {
        case 'map': {
          if (!this.rooms.length) {
            this.rooms = message.map!.map(r => {
              const room = new Room(r, this);
              this.grid.set(`${room.position.x},${room.position.y},${room.level}`, room);
              return room;
            });
            this.character!.room = this.rooms.find(r => r.name === 'entrance');
            this.character!.room!.known = true;
            this.init();
          }
          break;
        }
        case 'captured': {
          if (this.character?.uuid === message.playerId) {
            this.character.room?.element?.classList.remove('current');
            this.character.room = this.rooms.find(r => r.name === 'dungeon');
            this.character.room!.known = true;
            this.dialog?.showModal();
            setTimeout(() => {
              this.dialog?.close();
            }, 1500)
            this.render();
          }
          break;
        }
        case 'unlock': {
          this.character!.hasMoved = false;
          this.character?.buttons();
          break;
        }
        case 'win': {
          this.character!.hasMoved = true;
          this.dialog!.innerHTML = `
          🎃🎃🎃<br>
          ${message.playerName} has collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
          `
          this.dialog?.showModal();
        }
      }
    });

    this.channel = this.puppet.getChannel(channelId);
  }

  createCharacter = (name: string) => {
    this.character = new Character(name);
    this.character.game = this;

    this.channel?.send(JSON.stringify({
      action: 'join',
      playerId: this.character.uuid,
      playerName: name
    }));
  }

  channel?: Channel;
}

interface socketPacket {
  action: 'join' | 'move' | 'win' | 'captured' | 'map' | 'unlock';
  playerId: string;
  playerName: string;
  direction?: direction | 'up' | 'down';
  map?: Partial<Room>[];
}


