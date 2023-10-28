export type floors = "upper" | "lower" | "basement";
export type rooms =
  | "hallway"
  | "stairs"
  | "dining room"
  | "bedroom"
  | "parlor"
  | "library"
  | "cellar"
  | "dungeon"
  | "entrance"
  | "catacomb"
  | "alcoves"
  | "study"
  | "game room";
export interface room {
  name: rooms;
  floors: floors[];
}

export type gridAccessor = `${number},${number},${floors}`;

export const rooms: room[] = [
  {
    name: "bedroom",
    floors: ["upper"],
  },
  {
    name: "hallway",
    floors: ["upper", "lower", "basement"],
  },
  {
    name: "dining room",
    floors: ["lower"],
  },
  {
    name: "parlor",
    floors: ["lower", "upper"],
  },
  {
    name: "library",
    floors: ["lower", "upper"],
  },
  {
    name: "study",
    floors: ["lower", "upper"],
  },
  {
    name: "game room",
    floors: ["lower"],
  },
  {
    name: "cellar",
    floors: ["basement"],
  },
  {
    name: "catacomb",
    floors: ["basement"],
  },
  {
    name: "alcoves",
    floors: ["basement"],
  },
];

export type direction = "north" | "south" | "east" | "west";
export const directions: direction[] = ["north", "south", "east", "west"];

export const floors: floors[] = ["basement", "lower", "upper"];

export { Game } from "./Game.ts";

export { Room } from "./Room.ts";

export { Character } from "./Character.ts";

export { Player } from "./Player.ts";
