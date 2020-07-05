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
  actorId?: string;
};

export interface Action {
  type: ActionType;
}

export interface HeartbeatAction extends Action {
  playerId: string | null;
  type: "Heartbeat";
}

export function heartbeat(playerId: string | null): HeartbeatAction {
  return { type: "Heartbeat", playerId };
}

export interface PlayerJoinAction extends Action {
  player: Player;
  type: "PlayerJoin";
}

export function playerJoin(player: Player): PlayerJoinAction {
  return { type: "PlayerJoin", player };
}

export interface DropPieceAction extends Action {
  playerId: string;
  column: number;
  type: "DropPiece";
}

export function dropPiece(playerId: string, column: number): DropPieceAction {
  return { type: "DropPiece", playerId, column };
}

export function resetBoard(): Action {
  return { type: "ResetBoard" };
}
