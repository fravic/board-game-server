import { uniqBy } from "lodash";
import { v4 as uuid } from "uuid";

import { Action, PlayerJoinAction } from "./action";
import { Player, playerReducer } from "./player";
import { Node } from "./node";
import { Redis } from "../redis";
import { EpochSeconds, Reducer, currentEpochSeconds } from "./utils";

export interface Game extends Node {
  name: string;
  players: Array<Player>;
  lastUpdated: EpochSeconds;
}

export type GameReducer = (
  prev: Game
) => Promise<{ next: Game; changedNodes: Array<Node> }>;

export function create(fields: Pick<Game, "name"> & Partial<Game>): Game {
  const { id, name, players } = fields;
  return {
    id: id ?? uuid(),
    gqlName: "Game",
    name,
    players: players ?? [],
    lastUpdated: currentEpochSeconds(),
  };
}

export async function fetch(redis: Redis, id: string): Promise<Game> {
  return JSON.parse(await redis.get(id));
}

export async function save(game: Game, redis: Redis): Promise<Game> {
  await redis.set(game.id, JSON.stringify(game));
  return game;
}

export async function dispatchAction(
  gameId: string,
  action: Action,
  redis: Redis
): Promise<Game> {
  const fetchedGame = await fetch(redis, gameId);
  const clientUpdates: Array<Node> = [];
  const game = gameReducer(fetchedGame, action, clientUpdates);
  const clientUpdatesDeduped = uniqBy(clientUpdates, (n: Node) => n.id);
  await save(game, redis);
  await redis.pubsub.publish(
    gameId,
    JSON.stringify({ changedNodes: clientUpdatesDeduped })
  );
  console.dir([action, game], { depth: null });
  return game;
}

export const gameReducer: Reducer<Game> = (game, action, clientUpdates) => {
  let next = {
    ...game,
    lastUpdated: currentEpochSeconds(),
  };
  return _gameReducer(game, action, clientUpdates);
};

const _gameReducer: Reducer<Game> = (game, action, clientUpdates) => {
  let next = game;
  if (action.type === "PlayerJoin") {
    next = {
      ...game,
      players: [...game.players, (action as PlayerJoinAction).player],
    };
    clientUpdates.push(next);
  }
  return {
    ...next,
    players: next.players.map((p) => playerReducer(p, action, clientUpdates)),
  };
};
