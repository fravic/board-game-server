import { Player } from "./player";

export type ActionType = "PlayerJoin" | "GameStart";

export interface Action {
  type: ActionType;
}

export interface PlayerJoinAction extends Action {
  player: Player;
  type: "PlayerJoin";
}

export function playerJoin(player: Player): PlayerJoinAction {
  return { type: "PlayerJoin", player };
}

export function gameStart(): Action {
  return { type: "GameStart" };
}
