import { v4 as uuid } from "uuid";

import { Player } from "./player";
import { Redis } from "../redis";

export class Game {
  id: string;
  name: string;
  numPlayers: number;
  players: Array<Player> = [];

  constructor(fields: Partial<Game>) {
    const { id, name, numPlayers, players } = fields;
    this.id = id ?? uuid();
    this.name = name ?? "";
    this.numPlayers = numPlayers ?? 1;
    this.players = players ?? this.players;
  }

  static async fetch(redis: Redis, id: string): Promise<Game> {
    return Game.deserialize(await redis.get(id));
  }

  static serialize(game: Game): string {
    return JSON.stringify(game);
  }

  static deserialize(serialized: string): Game {
    const obj = JSON.parse(serialized);
    return new Game(obj);
  }

  async save(redis: Redis): Promise<Game> {
    if (!this.id) {
      throw new Error("No id on game, cannot save");
    }
    await redis.set(this.id, Game.serialize(this));
    return this;
  }
}
