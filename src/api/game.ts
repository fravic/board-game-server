import { v4 as uuid } from "uuid";

import { Action, PlayerJoinAction } from "./action";
import { Player } from "./player";
import { Node } from "./node";
import { Redis } from "../redis";

export interface Game extends Node {
  name: string;
  numPlayers: number;
  players: Array<Player>;
}

export type GameReducer = (
  prev: Game
) => Promise<{ next: Game; changedNodes: Array<Node> }>;

export function create(fields: Pick<Game, "name"> & Partial<Game>): Game {
  const { id, name, numPlayers, players } = fields;
  return {
    id: id ?? uuid(),
    gqlName: "Game",
    name,
    numPlayers: numPlayers ?? 1,
    players: players ?? [],
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
  const changedNodes: Array<Node> = [];
  const game = gameReducer(fetchedGame, action, changedNodes);
  await redis.pubsub.publish(gameId, JSON.stringify({ changedNodes }));
  return game;
}

type Reducer<ResultType> = (
  prev: ResultType,
  action: Action,
  changedNodes: Array<Node>
) => ResultType;

const gameReducer: Reducer<Game> = (game, action, changedNodes) => {
  const next = {
    ...game,
    gqlName: "Game",
    players: playersReducer(game.players, action, changedNodes),
  };
  // Right now, we're just sending the entire Game as the changed node. In the
  // future, we may not want to send the entire game state down on every event,
  // and instead just send the Game's sub-Nodes.
  changedNodes.push(next);
  return next;
};

const playersReducer: Reducer<Array<Player>> = (players, action) => {
  if (action.type === "PlayerJoin") {
    return [...players, (action as PlayerJoinAction).player];
  }
  return players;
};
