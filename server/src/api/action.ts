import { Player } from "./player";

export type ActionType = "PlayerJoin" | "GameStart" | "Heartbeat";

export interface Action {
  type: ActionType;
}

export function gameStart(): Action {
  return { type: "GameStart" };
}

export interface HeartbeatAction extends Action {
  playerId: string;
  type: "Heartbeat";
}

export function heartbeat(playerId: string): HeartbeatAction {
  return { type: "Heartbeat", playerId };
}

export interface PlayerJoinAction extends Action {
  player: Player;
  type: "PlayerJoin";
}

export function playerJoin(player: Player): PlayerJoinAction {
  return { type: "PlayerJoin", player };
}
