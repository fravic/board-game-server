import { v4 as uuid } from "uuid";

import { Player } from "./player";
import { Redis } from "../redis";

export type Game = {
  id: string;
  name: string;
  numPlayers: number;
  players: Array<Player>;
};

export const gameApi = {
  create(fields: Pick<Game, "name"> & Partial<Game>): Game {
    const { id, name, numPlayers, players } = fields;
    return {
      id: id ?? uuid(),
      name,
      numPlayers: numPlayers ?? 1,
      players: players ?? [],
    };
  },

  async fetch(redis: Redis, id: string): Promise<Game> {
    return JSON.parse(await redis.get(id));
  },

  async save(game: Game, redis: Redis): Promise<Game> {
    await redis.set(game.id, JSON.stringify(game));
    return game;
  },
};
