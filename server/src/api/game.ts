import { uniqBy } from "lodash";
import { v4 as uuid } from "uuid";

import { Action, PlayerJoinAction, ExpectedAction } from "./action";
import { Player, playerReducer } from "./player";
import { Node } from "./node";
import { Redis } from "../redis";
import { EpochSeconds, Reducer, currentEpochSeconds } from "./utils";

export interface Game extends Node {
  expectedActions: Array<ExpectedAction>;
  lastUpdated: EpochSeconds;
  name: string;
  players: Array<Player>;
}

export type GameReducer = (
  prev: Game
) => Promise<{ next: Game; changedNodes: Array<Node> }>;

export function create(fields: Pick<Game, "name"> & Partial<Game>): Game {
  const { id, name, players } = fields;
  return {
    expectedActions: [{ type: "PlayerJoin" }],
    gqlName: "Game",
    id: id ?? uuid(),
    lastUpdated: currentEpochSeconds(),
    name,
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
  actorId: string | null,
  redis: Redis
): Promise<Game> {
  const fetchedGame = await fetch(redis, gameId);

  // Validate the action
  if (
    fetchedGame.expectedActions.find((ex) =>
      isActionExpected(action, actorId, ex)
    ) === undefined
  ) {
    throw new Error(`Received unexpected action of type: ${action.type}`);
  }

  // Perform the action
  const clientUpdates: Array<Node> = [];
  const game = gameReducer(fetchedGame, action, clientUpdates);
  const clientUpdatesDeduped = uniqBy(clientUpdates, (n: Node) => n.id);

  // Publish the action
  await save(game, redis);
  await redis.pubsub.publish(
    gameId,
    JSON.stringify({ changedNodes: clientUpdatesDeduped })
  );
  console.dir([action, game], { depth: null });

  return game;
}

function isActionExpected(
  action: Action,
  actorId: string | null,
  expectedAction: ExpectedAction
): boolean {
  if (action.type === "Heartbeat") {
    return true;
  }
  // This logic may become more complex later (eg. with action categories)
  return (
    action.type === expectedAction.type &&
    (!expectedAction.actorId || actorId === expectedAction.actorId)
  );
}

export const gameReducer: Reducer<Game> = (game, action, clientUpdates) => {
  let next = {
    ...game,
    lastUpdated: currentEpochSeconds(),
  };
  return _gameReducer(game, action, clientUpdates);
};

const NUM_PLAYERS = 2;
const _gameReducer: Reducer<Game> = (game, action, clientUpdates) => {
  let next = game;
  if (action.type === "PlayerJoin") {
    next = {
      ...game,
      players: [...game.players, (action as PlayerJoinAction).player],
    };
    if (game.players.length === NUM_PLAYERS) {
      next = {
        ...game,
        expectedActions: [{ type: "GameStart" }],
      };
    }
    clientUpdates.push(next);
  }
  return {
    ...next,
    players: next.players.map((p) => playerReducer(p, action, clientUpdates)),
  };
};
