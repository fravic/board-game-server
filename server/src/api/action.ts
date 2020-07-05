import { Player } from "./player";

export const actionType = [
  "Heartbeat",
  "PlayerJoin",
  "DropPiece",
  "ResetBoard",
] as const;

export type ActionType = typeof actionType[number];

export type ExpectedAction = {
  type: ActionType;
  actorPlayerNum?: number;
};

export interface Action {
  type: ActionType;
}

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
