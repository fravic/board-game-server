import { Player } from "./player";
import { GameObject } from "./game_object";

export const actionType = [
  "Heartbeat",
  "PlayerJoin",
  "DropPiece",
  "ResetBoard",
] as const;

export type ActionType = typeof actionType[number];

export interface Action {
  type: ActionType;
}

export type ExpectedAction = {
  type: ActionType;
  actorPlayerNum?: number;
};

export interface ExpectedActions extends GameObject {
  gqlName: "ExpectedActions";
  actions: Array<ExpectedAction>;
}

export const expectedActions = (
  gameId: string,
  actions: Array<ExpectedAction>,
  key?: string
): ExpectedActions => ({
  gameId,
  gqlName: "ExpectedActions",
  key: key ?? "expectedActions",
  actions,
});

export const isActionExpected = (
  action: Action,
  actorPlayerNum: number | null,
  expectedActions: ExpectedActions
): boolean => {
  if (action.type === "Heartbeat") {
    // Heartbeats are always expected
    return true;
  }
  return (
    expectedActions.actions.find((ex) => {
      // This logic may become more complex later (eg. with action categories)
      return (
        action.type === ex.type &&
        (ex.actorPlayerNum === undefined ||
          actorPlayerNum === ex.actorPlayerNum)
      );
    }) !== undefined
  );
};

/* --- Action Types --- */

export interface HeartbeatAction extends Action {
  playerNum: number | null;
  type: "Heartbeat";
}

export function heartbeat(playerNum: number | null): HeartbeatAction {
  return { type: "Heartbeat", playerNum };
}

export interface PlayerJoinAction extends Action {
  player: Player;
  type: "PlayerJoin";
}

export function playerJoin(player: Player): PlayerJoinAction {
  return { type: "PlayerJoin", player };
}

export interface DropPieceAction extends Action {
  playerNum: number;
  column: number;
  type: "DropPiece";
}

export function dropPiece(playerNum: number, column: number): DropPieceAction {
  return { type: "DropPiece", playerNum, column };
}

export function resetBoard(): Action {
  return { type: "ResetBoard" };
}
