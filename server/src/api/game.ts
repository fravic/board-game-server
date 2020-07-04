import { enablePatches, produceWithPatches, Patch } from "immer";
import { uniqBy } from "lodash";
import { v4 as uuid } from "uuid";

import { Action, PlayerJoinAction, ExpectedAction } from "./action";
import { Player, playerReducer } from "./player";
import { Node } from "./node";
import { Redis } from "../redis";

export interface Game extends Node {
  expectedActions: Array<ExpectedAction>;
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
  const [game, patches] = gameReducer(fetchedGame, action);
  // Note: changedNodes is shallow; only accounts for one level of nodes under Game
  const changedNodes = uniqBy(
    patches.map(getChangedNodeFromPatch(game)),
    (n) => n.id
  );

  // Publish the action
  await save(game, redis);
  await redis.pubsub.publish(gameId, JSON.stringify({ changedNodes: game }));
  console.dir([action, game, changedNodes], { depth: null });

  return game;
}

const isActionExpected = (
  action: Action,
  actorId: string | null,
  expectedAction: ExpectedAction
): boolean => {
  if (action.type === "Heartbeat") {
    return true;
  }
  // This logic may become more complex later (eg. with action categories)
  return (
    action.type === expectedAction.type &&
    (!expectedAction.actorId || actorId === expectedAction.actorId)
  );
};

const getChangedNodeFromPatch = (game: Game) => (patch: Patch) => {
  if (patch.op === "replace" && patch.value.id) {
    // If a replace operation was done with a value that has an id, that node
    // must have been changed
    return patch.value;
  }
  // Otherwise, the game itself must have been changed
  return game;
};

const NUM_PLAYERS = 2;

enablePatches();
export const gameReducer = produceWithPatches((draft: Game, action: Action) => {
  if (action.type === "PlayerJoin") {
    draft.players.push((action as PlayerJoinAction).player);
    if (draft.players.length === NUM_PLAYERS) {
      draft.expectedActions = [{ type: "GameStart" }];
    }
  }
  draft.players.forEach(
    (player, idx) => (draft.players[idx] = playerReducer(player, action))
  );
});
