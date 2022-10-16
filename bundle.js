// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class Character {
    name;
    uuid;
    room;
    game;
    hasMoved = true;
    gatheredTreasures = [];
    constructor(name){
        this.name = name;
        this.uuid = window.crypto.randomUUID();
    }
    get validSpaces() {
        const spaces = this.room.doors.map((d)=>[
                d,
                this.room?.neighbors[d]
            ]);
        if (this.room?.name === 'stairs') {
            const currentLevel = this.room.level;
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
                }
            };
            spaces.push([
                'up',
                this.game?.rooms.find((r)=>r.name === 'stairs' && r.level === options['up'][currentLevel] && currentLevel !== options['up'][currentLevel])
            ]);
            spaces.push([
                'down',
                this.game?.rooms.find((r)=>r.name === 'stairs' && r.level === options['down'][currentLevel] && currentLevel !== options['down'][currentLevel])
            ]);
        }
        return spaces.filter((s)=>!!s[1]);
    }
    init = ()=>{
        const buttons = document.querySelectorAll('button.movement');
        buttons.forEach((b)=>b.addEventListener('click', (e)=>{
                const dir = e.target.dataset.dir;
                this.move(dir);
            }));
    };
    buttons = ()=>{
        const buttons = document.querySelectorAll('button.movement');
        const validSpaces = this.validSpaces;
        buttons.forEach((b)=>{
            const dir = b.dataset.dir;
            const room = validSpaces?.find((s)=>s[0] === dir);
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
    };
    move = (dir)=>{
        if (dir) {
            this.hasMoved = true;
            this.room?.element?.classList.remove('current');
            if (dir === 'up' || dir === 'down') {
                const currentLevel = this.room.level;
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
                    }
                };
                this.room = this.game?.rooms.find((r)=>r.name === 'stairs' && r.level === options[dir][currentLevel]);
            } else {
                this.room = this.room.neighbors[dir];
            }
            this.room.known = true;
            if (this.room?.hasTreasure && !this.gatheredTreasures.includes(this.room.accessor)) {
                this.gatheredTreasures.push(this.room.accessor);
            }
            if (!this.game?.isHost && this.gatheredTreasures.length === 3 && this.room?.name === 'entrance') {
                this.game.dialog.innerHTML = `
        🎃🎃🎃<br>
          Congratulations! You have collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
        `;
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
            }));
        } else {
            const validSpaces = this.validSpaces;
            this.room = validSpaces[Math.floor(Math.random() * validSpaces.length)][1];
        }
    };
}
class Channel {
    id;
    socket;
    callbacks = [];
    joinCallbacks = [];
    leaveCallbacks = [];
    echo;
    constructor(id, socket){
        this.id = id;
        this.socket = socket;
    }
    send = (message, clientToSendTo)=>this.socket.send(JSON.stringify({
            send_packet: {
                to: this.id,
                message,
                clientToSendTo,
                echo: this.echo
            }
        }));
    addListener = (callback)=>this.callbacks.push(callback);
    onJoinConfirm = (callback)=>this.joinCallbacks.push(callback);
    onLeave = (callback)=>this.leaveCallbacks.push(callback);
    execListeners = (message)=>this.callbacks.forEach((cb)=>cb(message));
    execJoinListeners = ()=>this.joinCallbacks.forEach((cb)=>cb('join'));
    execLeaveListeners = ()=>this.leaveCallbacks.forEach((cb)=>cb('leave'));
}
class Message {
    from;
    to;
    message;
    event;
    status;
    channelId;
    constructor(m){
        this.to = m.to;
        this.from = m.from;
        this.message = m.message;
        this.event = m.event;
        this.status = m.status;
        this.channelId = m.channelId;
    }
}
class Sockpuppet {
    socket;
    channels;
    callbacks;
    constructor(path, onConnect){
        if (isFullUrl(path)) this.socket = new WebSocket(path);
        else this.socket = new WebSocket(`${window.location.host}${path}`);
        if (onConnect) this.socket.addEventListener('open', ()=>{
            onConnect();
        });
        this.socket.addEventListener('message', this.handleMessage);
        this.channels = new Map();
        this.callbacks = new Map([
            [
                'disconnect',
                []
            ]
        ]);
    }
    joinChannel = (channelId, handler)=>{
        if (this.socket.readyState === 1) {
            const channel = new Channel(channelId, this.socket);
            this.channels.set(channelId, channel);
            channel.addListener(handler);
            this.socket.send(JSON.stringify({
                connect_to: [
                    channelId
                ]
            }));
        } else {
            this.socket.addEventListener('open', ()=>{
                const channel = new Channel(channelId, this.socket);
                this.channels.set(channelId, channel);
                channel.addListener(handler);
                this.socket.send(JSON.stringify({
                    connect_to: [
                        channelId
                    ]
                }));
            });
        }
    };
    on = (event, callback)=>{
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []).get;
        }
        this.callbacks.get(event)?.push(callback);
    };
    onDisconnect = (callback)=>this.callbacks.get('disconnect')?.push(callback);
    handleMessage = (message)=>{
        console.log(message.data);
        switch(message.data){
            case "open":
            case "connected":
                break;
            case "disconnected":
                this.callbacks.get('disconnect')?.forEach((cb)=>cb(message.data));
                this.channels.forEach((channel)=>channel.execLeaveListeners());
                break;
            default:
                try {
                    const msg = new Message(JSON.parse(message.data));
                    this.callbacks.get('message')?.forEach((cb)=>cb(msg));
                    if (msg.event === 'leave') this.deleteChannel(msg.to);
                    if (msg.event === 'join') this.channels.get(msg.to)?.execJoinListeners();
                    if (msg.event === 'create') this.onChannelCreate(msg);
                    this.callbacks.get(msg.event || msg.message)?.forEach((cb)=>cb(msg));
                    this.channels.get(msg.to)?.execListeners(msg.message);
                } catch (_e) {
                    const msg1 = message.data;
                    this.callbacks.get(msg1)?.forEach((cb)=>cb(msg1));
                }
                break;
        }
    };
    leaveChannel = (channelId)=>this.socket.send(JSON.stringify({
            disconnect_from: [
                channelId
            ]
        }));
    deleteChannel = (channelId)=>{
        const channel = this.channels.get(channelId);
        if (channel) {
            channel.execLeaveListeners();
            this.channels.delete(channelId);
        }
    };
    getChannel = (channelId)=>this.channels.get(channelId);
    createChannel = (channelId)=>new Promise((res, rej)=>{
            this.socket.send(JSON.stringify({
                create_channel: channelId
            }));
            const poll = setInterval(()=>{
                const channelMessage = this.channelCreateMessages.get(channelId);
                if (channelMessage) {
                    clearInterval(poll);
                    switch(channelMessage.status){
                        case 'FAILED':
                            rej(channelMessage);
                            break;
                        case 'SUCCESS':
                            res(channelMessage);
                            break;
                    }
                    this.channelCreateMessages.delete(channelId);
                }
            }, 10);
        });
    channelCreateMessages = new Map();
    onChannelCreate = (msg)=>{
        this.channelCreateMessages.set(msg.channelId, msg);
    };
}
const isFullUrl = (url)=>/(wss?|https?):\/\/.+\.(io|com|org|net)(\/.*)?/i.test(url) || url.includes('localhost');
const rooms = [
    {
        name: 'bedroom',
        floors: [
            'upper'
        ]
    },
    {
        name: 'hallway',
        floors: [
            'upper',
            'lower',
            'basement'
        ]
    },
    {
        name: 'dining room',
        floors: [
            'lower'
        ]
    },
    {
        name: 'parlor',
        floors: [
            'lower',
            'upper'
        ]
    },
    {
        name: 'library',
        floors: [
            'lower',
            'upper'
        ]
    },
    {
        name: 'cellar',
        floors: [
            'basement'
        ]
    },
    {
        name: 'catacomb',
        floors: [
            'basement'
        ]
    },
    {
        name: 'alcoves',
        floors: [
            'basement'
        ]
    }, 
];
const directions = [
    'north',
    'south',
    "east",
    "west"
];
class Room {
    level;
    name;
    uuid;
    position;
    unique;
    game;
    doors;
    characters = [];
    hasTreasure;
    element;
    known = false;
    constructor(r, g){
        this.level = r.level;
        this.name = r.name;
        this.hasTreasure = r.hasTreasure || false;
        this.doors = r.doors || [];
        this.position = r.position;
        this.uuid = window.crypto.randomUUID();
        this.game = g;
    }
    get neighbors() {
        return {
            north: this.game?.grid.get(`${this.position.x},${this.position.y - 1},${this.level}`),
            south: this.game?.grid.get(`${this.position.x},${this.position.y + 1},${this.level}`),
            east: this.game?.grid.get(`${this.position.x + 1},${this.position.y},${this.level}`),
            west: this.game?.grid.get(`${this.position.x - 1},${this.position.y},${this.level}`)
        };
    }
    generateDoors = ()=>{
        if (this.neighbors.north?.doors.includes('south')) this.doors.push('north');
        if (this.neighbors.west?.doors.includes('east')) this.doors.push('west');
        if (this.position.y !== this.game.gridSize.y - 1 && Math.random() > this.doors.length / 5) this.doors.push('south');
        if (this.position.x !== this.game.gridSize.x - 1 && Math.random() > this.doors.length / 5) this.doors.push('east');
        if (this.doors.length === 0 || this.doors.length === 1) {
            let randomDoor = directions[Math.floor(Math.random() * directions.length)];
            tryAdd: while(this.doors.length === 0){
                randomDoor = directions[Math.floor(Math.random() * directions.length)];
                switch(randomDoor){
                    case 'east':
                        {
                            if (this.position.x === this.game.gridSize.x - 1) continue tryAdd;
                            this.neighbors.east?.doors.push('west');
                            break;
                        }
                    case 'west':
                        {
                            if (this.position.x === 0) continue tryAdd;
                            this.neighbors.west?.doors.push('east');
                            break;
                        }
                    case 'north':
                        {
                            if (this.position.y === 0) continue tryAdd;
                            this.neighbors.north?.doors.push('south');
                            break;
                        }
                    case 'south':
                        {
                            if (this.position.y === this.game.gridSize.y - 1) continue tryAdd;
                            this.neighbors.south?.doors.push('north');
                            break;
                        }
                }
                this.doors.push(randomDoor);
            }
        }
        this.doors = Array.from(new Set(this.doors));
    };
    get accessor() {
        return `${this.position.x},${this.position.y},${this.level}`;
    }
}
const floors = [
    'basement',
    'lower',
    'upper'
];
class Game {
    rooms = [];
    characters = new Map();
    gridSize = {
        x: 4,
        y: 5
    };
    grid = new Map();
    entrance = {
        x: 0,
        y: 0
    };
    isHost = false;
    character;
    dialog = document.querySelector('dialog');
    tick = ()=>{
        this.skeletonCheck();
        this.skeletonMove();
        this.render();
    };
    generate = ()=>{
        const floors = [
            'basement',
            'lower',
            'upper'
        ];
        this.grid = new Map();
        this.rooms = [];
        for (const floor of floors){
            const stairX = Math.floor(Math.random() * this.gridSize.x);
            const stairY = Math.floor(Math.random() * this.gridSize.y);
            const stairs = new Room({
                name: 'stairs',
                position: {
                    x: stairX,
                    y: stairY
                },
                level: floor
            }, this);
            this.grid.set(`${stairX},${stairY},${floor}`, stairs);
            if (floor === 'basement') {
                let dungeonX = Math.floor(Math.random() * this.gridSize.x);
                let dungeonY = Math.floor(Math.random() * this.gridSize.y);
                const dungeon = new Room({
                    name: 'dungeon',
                    position: {
                        x: dungeonX,
                        y: dungeonY
                    },
                    level: floor
                }, this);
                while(this.grid.get(`${dungeonX},${dungeonY},${floor}`)){
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
                    position: {
                        x: entranceX,
                        y: entranceY
                    },
                    level: floor
                }, this);
                entrance.known = true;
                while(this.grid.get(`${entranceX},${entranceY},${floor}`)){
                    entranceX = Math.floor(Math.random() * this.gridSize.x);
                    entranceY = Math.floor(Math.random() * this.gridSize.y);
                }
                this.grid.set(`${entranceX},${entranceY},${floor}`, entrance);
                this.entrance = {
                    x: entranceX,
                    y: entranceY
                };
            }
            for(let x = 0; x < this.gridSize.x; x++){
                for(let y = 0; y < this.gridSize.y; y++){
                    if (!this.grid.get(`${x},${y},${floor}`)) {
                        const validRooms = rooms.filter((r)=>r.floors.includes(floor));
                        const selectedRoom = validRooms[Math.floor(Math.random() * validRooms.length)];
                        const room = new Room({
                            name: selectedRoom.name,
                            level: floor,
                            position: {
                                x,
                                y
                            }
                        }, this);
                        this.grid.set(`${x},${y},${floor}`, room);
                    }
                }
            }
        }
        for (const floor1 of floors){
            for(let x1 = 0; x1 < this.gridSize.x; x1++){
                for(let y1 = 0; y1 < this.gridSize.y; y1++){
                    const room1 = this.grid.get(`${x1},${y1},${floor1}`);
                    room1?.generateDoors();
                }
            }
            const bannedRooms = [
                'hallway',
                'stairs',
                "entrance"
            ];
            let treasureRoom = this.grid.get(this.randomSelector(floor1));
            while(!treasureRoom?.doors.length || bannedRooms.includes(treasureRoom.name)){
                treasureRoom = this.grid.get(this.randomSelector(floor1));
            }
            treasureRoom.hasTreasure = true;
        }
        const skeletonCount = Number(localStorage.getItem('skeletons') || '3');
        for(let i = 0; i < skeletonCount; i++){
            const skeleton = new Character('skeleton');
            skeleton.room = this.grid.get(this.randomSelector());
            this.characters.set(skeleton.uuid, skeleton);
        }
        for (const room2 of this.grid.values())this.rooms.push(room2);
    };
    init = ()=>{
        const rooms = Array.from(this.grid.values()).sort((a)=>{
            if (a.level === 'basement') return -1;
            if (a.level === 'lower') return 0;
            if (a.level === 'upper') return 1;
            return 0;
        }).sort((a, b)=>{
            const posA = a.position;
            const posB = b.position;
            return posA.x - posB.x;
        }).sort((a, b)=>{
            const posA = a.position;
            const posB = b.position;
            return posA.y - posB.y;
        });
        document.querySelectorAll('.floor').forEach((f)=>f.innerHTML = '');
        for (const room of rooms){
            const floor = document.querySelector(`.floor#${room.level}`);
            const div = document.createElement('div');
            div.textContent = room.name;
            div.classList.add(...room.doors);
            div.classList.add('hidden');
            for (const character of this.characters.values()){
                if (character.room === room) div.textContent += ' 💀';
            }
            if (room.hasTreasure) div.classList.add('treasure');
            floor?.append(div);
            room.element = div;
        }
        this.character?.init();
        this.render();
    };
    render = ()=>{
        const rooms = this.rooms;
        for (const room of rooms){
            if (!this.isHost && !room.known) room.element?.classList.add('hidden');
            else room.element?.classList.remove('hidden');
            if (this.character?.room === room) {
                room.element?.classList.add('current');
            }
        }
        if (!this.isHost) {
            document.querySelectorAll('.floor[data-floor]').forEach((f)=>{
                const floor = f.dataset.floor;
                if (floor === this.character?.room?.level) {
                    f.classList.remove('hidden');
                } else {
                    f.classList.add('hidden');
                }
            });
            const nameDict = {
                lower: 'Ground Floor',
                upper: 'Upstairs',
                basement: 'Basement'
            };
            document.querySelector('.floor-name').textContent = nameDict[this.character.room.level];
            document.querySelector('.score').textContent = `You have gathered ${this.character?.gatheredTreasures.length} treasures`;
        }
        if (this.isHost) {
            const skeletons = Array.from(this.characters.values()).filter((c)=>c.name === 'skeleton');
            for (const room1 of this.rooms){
                room1.element.textContent = room1.name;
                for (const character of skeletons){
                    if (character.room === room1) {
                        room1.element.textContent += ' 💀';
                    }
                }
            }
            for (const character1 of this.characters.values()){
                if (character1.name !== 'skeleton') {
                    character1.room?.element?.classList.add('current');
                }
            }
        }
        this.character?.buttons();
    };
    randomSelector = (floor)=>`${Math.floor(Math.random() * this.gridSize.x)},${Math.floor(Math.random() * this.gridSize.y)},${floor || floors[Math.floor(Math.random() * floors.length)]}`;
    skeletonCheck = ()=>{
        const characters = Array.from(this.characters.values());
        const skeletons = characters.filter((c)=>c.name === "skeleton");
        for (const character of characters){
            if (character.name !== 'skeleton') {
                for (const skeleton of skeletons){
                    if (character.room === skeleton.room) {
                        character.room?.element?.classList.remove('current');
                        character.room = this.rooms.find((r)=>r.name === 'dungeon');
                        this.channel?.send(JSON.stringify({
                            action: 'captured',
                            playerId: character.uuid
                        }));
                        this.render();
                    }
                }
            }
        }
    };
    skeletonMove = ()=>{
        const characters = Array.from(this.characters.values());
        const skeletons = characters.filter((c)=>c.name === "skeleton");
        for (const skeleton of skeletons){
            skeleton.move();
        }
        this.skeletonCheck();
    };
    checkPlayerMoves = ()=>{
        const characters = Array.from(this.characters.values()).filter((c)=>c.name !== "skeleton");
        if (characters.every((c)=>c.hasMoved)) {
            this.tick();
            setTimeout(()=>{
                characters.forEach((c)=>c.hasMoved = false);
                this.channel?.send(JSON.stringify({
                    action: 'unlock'
                }));
            }, 2000);
        }
    };
    puppet = new Sockpuppet('wss://skirmish.ursadesign.io');
    hostGame = async ()=>{
        this.isHost = true;
        this.generate();
        this.init();
        const channelId = 'spooky_scary_skeletons';
        await this.puppet.createChannel(channelId);
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case 'join':
                    {
                        const __char = new Character(message.playerName);
                        __char.room = this.rooms.find((r)=>r.name === 'entrance');
                        __char.game = this;
                        __char.uuid = message.playerId;
                        this.characters.set(message.playerId, __char);
                        const map = this.rooms.map((r)=>({
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
                case 'move':
                    {
                        this.characters.get(message.playerId)?.move(message.direction);
                        this.checkPlayerMoves();
                        break;
                    }
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    startGame = ()=>{
        this.channel?.send(JSON.stringify({
            action: 'unlock'
        }));
        document.querySelector('.buttons').innerHTML = '';
    };
    joinGame = ()=>{
        this.isHost = false;
        const channelId = 'spooky_scary_skeletons';
        this.puppet.joinChannel(channelId, (msg)=>{
            const message = JSON.parse(msg);
            switch(message.action){
                case 'map':
                    {
                        if (!this.rooms.length) {
                            this.rooms = message.map.map((r)=>{
                                const room = new Room(r, this);
                                this.grid.set(`${room.position.x},${room.position.y},${room.level}`, room);
                                return room;
                            });
                            this.character.room = this.rooms.find((r)=>r.name === 'entrance');
                            this.character.room.known = true;
                            this.init();
                        }
                        break;
                    }
                case 'captured':
                    {
                        if (this.character?.uuid === message.playerId) {
                            this.character.room?.element?.classList.remove('current');
                            this.character.room = this.rooms.find((r)=>r.name === 'dungeon');
                            this.character.room.known = true;
                            this.dialog?.showModal();
                            setTimeout(()=>{
                                this.dialog?.close();
                            }, 2000);
                            this.render();
                        }
                        break;
                    }
                case 'unlock':
                    {
                        this.character.hasMoved = false;
                        this.character?.buttons();
                        break;
                    }
                case 'win':
                    {
                        this.character.hasMoved = true;
                        this.dialog.innerHTML = `
          🎃🎃🎃<br>
          ${message.playerName} has collected all of the treasures and escaped to safety!<br>
          🎃🎃🎃
          `;
                        this.dialog?.showModal();
                    }
            }
        });
        this.channel = this.puppet.getChannel(channelId);
    };
    createCharacter = (name)=>{
        this.character = new Character(name);
        this.character.game = this;
        this.channel?.send(JSON.stringify({
            action: 'join',
            playerId: this.character.uuid,
            playerName: name
        }));
    };
    channel;
}
const game = new Game();
const init = ()=>{
    const buttonContainer = document.querySelector('.buttons');
    if (buttonContainer) {
        const hostButton = document.createElement('button');
        hostButton.textContent = 'Host';
        hostButton.dataset.dir = 'west';
        hostButton.addEventListener('click', host);
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join';
        joinButton.dataset.dir = 'east';
        joinButton.addEventListener('click', join);
        buttonContainer.append(hostButton, joinButton);
    }
};
const join = ()=>{
    game.joinGame();
    const name = prompt('What name would you like to use?') || 'Treasure Hunter';
    game.createCharacter(name);
    document.querySelector('.buttons').innerHTML = `
  <button class="movement" data-dir="north">North</button>
  <button class="movement" data-dir="south">South</button>
  <button class="movement" data-dir="east">East</button>
  <button class="movement" data-dir="west">West</button>
  <button class="movement" data-dir="up">Up</button>
  <button class="movement" data-dir="down">Down</button>`;
};
const host = ()=>{
    game.hostGame();
    const container = document.querySelector('.buttons');
    if (container) {
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.dataset.dir = 'north';
        startButton.addEventListener('click', game.startGame);
        container.append(startButton);
    }
};
init();
