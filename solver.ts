import { rooms } from "./models/index.ts";
import { Room } from "./models/Room.ts";

export const solver = (rooms: Room[]) => {
  const basementStairs = rooms.find((r) =>
    r.name === "stairs" && r.level === "basement"
  )!;
  const lowerStairs = rooms.find((r) =>
    r.name === "stairs" && r.level === "lower"
  )!;
  const upperStairs = rooms.find((r) =>
    r.name === "stairs" && r.level === "upper"
  )!;

  return recursiveSearch(basementStairs, [], "dungeon") &&
    recursiveSearch(basementStairs, [], "treasure") &&
    recursiveSearch(lowerStairs, [], "entrance") &&
    recursiveSearch(lowerStairs, [], "treasure") &&
    recursiveSearch(upperStairs, [], "treasure");
};

export const recursiveSearch = (
  current: Room,
  last: Room[],
  target: rooms | "treasure" | Room,
) => {
  if (target === "treasure" && current.hasTreasure) return true;
  if (target === current.name) return true;
  if (target === current) return true;

  for (const door of current.doors) {
    if (
      current.neighbors[door] && !last.includes(current.neighbors[door]!) &&
      recursiveSearch(current.neighbors[door]!, [...last, current], target)
    ) {
      return true;
    }
  }

  return false;
};
