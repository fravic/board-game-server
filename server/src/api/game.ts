import { enablePatches, produceWithPatches, Patch } from "immer";
import { uniqBy } from "lodash";
import { v4 as uuid } from "uuid";

import {
  Action,
  PlayerJoinAction,
  DropPieceAction,
  ExpectedActions,
  expectedActions,
  isActionExpected,
} from "./action";
import { Context } from "../context";
import { Player, playerReducer } from "./player";
import { GameObject } from "./game_object";
import { Redis } from "../redis";
import * as boardApi from "./board";
import {
  randomColorHex,
  EpochSeconds,
  currentEpochSeconds,
  Mutex,
} from "./utils";

export interface Game extends GameObject {
  gqlName: "Game";
  expectedActions: ExpectedActions;
  lastUpdated: EpochSeconds;
  name: string;
  players: Array<Player>;
  board: boardApi.Board;
}

export function create(fields: Pick<Game, "name"> & Partial<Game>): Game {
  const { name, players } = fields;
  const gameId = fields.gameId ?? uuid();
  return {
    expectedActions: expectedActions(gameId, [{ type: "PlayerJoin" }]),
    gqlName: "Game",
    gameId,
    key: "game",
    name,
    lastUpdated: currentEpochSeconds(),
    players: players ?? [],
    board: boardApi.create(gameId),
  };
}

export class GameNotFoundError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, GameNotFoundError.prototype);
  }
}

export async function fetch(id: string, redis: Redis): Promise<Game> {
  const unparsed = await redis.get(id);
  if (!unparsed) {
    throw new GameNotFoundError(`Could not find game with id ${id}`);
  }
  return JSON.parse(unparsed);
}

export async function save(game: Game, redis: Redis): Promise<Game> {
  await redis.set(game.gameId, JSON.stringify(game));
  return game;
}

const dispatchActionMutex = new Mutex();

export async function dispatchAction(
  gameId: string,
  action: Action,
  actorPlayerNum: number | null,
  context: Context
): Promise<Game> {
  // Ensure only one action is processed at a time
  return await dispatchActionMutex.dispatch(async () => {
    const fetchedGame = await fetch(gameId, context.redis);

    // Validate the action
    if (
      !isActionExpected(action, actorPlayerNum, fetchedGame.expectedActions)
    ) {
      console.error(
        "Received unexpected action",
        JSON.stringify(action, null, 2),
        "expected",
        JSON.stringify(fetchedGame.expectedActions, null, 2)
      );
      throw new Error(`Received unexpected action of type: ${action.type}`);
    }

    // Perform the action
    const [game, patches] = gameReducer(fetchedGame, action);
    // Note: changed array is shallow; only accounts for one level of GameObjects under Game
    const changed = uniqBy(patches.map(getChangedFromPatch(game)), n => n.key);

    // Publish the action (if any Nodes changed)
    await save(game, context.redis);
    if (changed.length) {
      await context.pubsub.publish(gameId, JSON.stringify({ changed }));
      if (action.type !== "Heartbeat") {
        console.dir([gameId, action], { depth: null });
      }
    }

    return game;
  });
}

// Paths in the denylist will not result in an update being published to clients
const CHANGED_PATH_DENYLIST = new Set<string | number>(["lastUpdated"]);

const getChangedFromPatch = (game: Game) => (patch: Patch) => {
  if (
    patch.op === "replace" &&
    patch.value.key &&
    !CHANGED_PATH_DENYLIST.has(patch.path[0])
  ) {
    // If a replace operation was done with a value that has a key, that object
    // must have been changed
    return patch.value;
  }
  // Otherwise, the game itself must have been changed
  return game;
};

const NUM_PLAYERS = 2;

enablePatches();
export const gameReducer = produceWithPatches((draft: Game, action: Action) => {
  const { gameId } = draft;
  if (action.type === "PlayerJoin") {
    const player = {
      ...(action as PlayerJoinAction).player,
      colorHex: randomColorHex(
        draft.players[0] ? draft.players[0].colorHex : null
      ),
    };
    draft.players.push(player);
    if (draft.players.length === NUM_PLAYERS) {
      draft.expectedActions = expectedActions(gameId, [
        { type: "DropPiece", actorPlayerNum: 0 },
      ]);
    }
  } else if (action.type === "DropPiece") {
    const dropPieceAction = action as DropPieceAction;
    draft.board = boardApi.boardReducer(draft.board, action);
    if (draft.board.winningPlayerNum !== null) {
      draft.expectedActions = expectedActions(gameId, [{ type: "ResetBoard" }]);
    } else {
      draft.expectedActions = expectedActions(gameId, [
        {
          type: "DropPiece",
          actorPlayerNum:
            (dropPieceAction.playerNum + 1) % draft.players.length,
        },
      ]);
    }
  } else if (action.type === "ResetBoard") {
    draft.board = boardApi.boardReducer(draft.board, action);
    draft.expectedActions = expectedActions(gameId, [
      {
        type: "DropPiece",
        actorPlayerNum: Math.floor(Math.random() * NUM_PLAYERS),
      },
    ]);
  }

  draft.players.forEach(
    (player, idx) => (draft.players[idx] = playerReducer(player, action))
  );

  draft.lastUpdated = currentEpochSeconds();
});
