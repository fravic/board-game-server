import { enablePatches, produceWithPatches, Patch } from "immer";
import { uniqBy } from "lodash";
import { v4 as uuid } from "uuid";

import {
  Action,
  PlayerJoinAction,
  ExpectedAction,
  DropPieceAction,
} from "./action";
import { Player, playerReducer } from "./player";
import { GameObject } from "./game_object";
import { Redis } from "../redis";
import * as boardApi from "./board";
import { randomColorHex } from "./utils";

export interface Game extends GameObject {
  gqlName: "Game";
  expectedActions: Array<ExpectedAction>;
  name: string;
  players: Array<Player>;
  board: boardApi.Board;
}

export function create(fields: Pick<Game, "name"> & Partial<Game>): Game {
  const { name, players } = fields;
  const gameId = fields.gameId ?? uuid();
  return {
    expectedActions: [{ type: "PlayerJoin" }],
    gqlName: "Game",
    gameId,
    key: "game",
    name,
    players: players ?? [],
    board: boardApi.create(gameId),
  };
}

export async function fetch(id: string, redis: Redis): Promise<Game> {
  return JSON.parse(await redis.get(id));
}

export async function save(game: Game, redis: Redis): Promise<Game> {
  await redis.set(game.gameId, JSON.stringify(game));
  return game;
}

export async function dispatchAction(
  gameId: string,
  action: Action,
  actorPlayerNum: number | null,
  redis: Redis
): Promise<Game> {
  const fetchedGame = await fetch(gameId, redis);

  // Validate the action
  if (
    fetchedGame.expectedActions.find((ex) =>
      isActionExpected(action, actorPlayerNum, ex)
    ) === undefined
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
  const changed = uniqBy(patches.map(getChangedFromPatch(game)), (n) => n.id);

  // Publish the action (if any Nodes changed)
  await save(game, redis);
  if (changed.length) {
    await redis.pubsub.publish(gameId, JSON.stringify({ changed }));
    if (action.type !== "Heartbeat") {
      console.dir([action, changed], { depth: null });
    }
  }

  return game;
}

const isActionExpected = (
  action: Action,
  actorPlayerNum: number | null,
  expectedAction: ExpectedAction
): boolean => {
  if (action.type === "Heartbeat") {
    return true;
  }
  // This logic may become more complex later (eg. with action categories)
  return (
    action.type === expectedAction.type &&
    (expectedAction.actorPlayerNum === undefined ||
      actorPlayerNum === expectedAction.actorPlayerNum)
  );
};

const getChangedFromPatch = (game: Game) => (patch: Patch) => {
  if (patch.op === "replace" && patch.value.id) {
    // If a replace operation was done with a value that has an id, that object
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
    const player = {
      ...(action as PlayerJoinAction).player,
      colorHex: randomColorHex(
        draft.players[0] ? draft.players[0].colorHex : null
      ),
    };
    draft.players.push(player);
    if (draft.players.length === NUM_PLAYERS) {
      draft.expectedActions = [{ type: "DropPiece", actorPlayerNum: 0 }];
    }
  } else if (action.type === "DropPiece") {
    const dropPieceAction = action as DropPieceAction;
    draft.board = boardApi.boardReducer(draft.board, action);
    if (draft.board.winningPlayerNum !== null) {
      draft.expectedActions = [{ type: "ResetBoard" }];
    } else {
      draft.expectedActions = [
        {
          type: "DropPiece",
          actorPlayerNum:
            (dropPieceAction.playerNum + 1) % draft.players.length,
        },
      ];
    }
  } else if (action.type === "ResetBoard") {
    draft.board = boardApi.boardReducer(draft.board, action);
    draft.expectedActions = [{ type: "DropPiece", actorPlayerNum: 0 }];
  }

  draft.players.forEach(
    (player, idx) => (draft.players[idx] = playerReducer(player, action))
  );
});
