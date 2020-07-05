import { produce } from "immer";

import { GameObject } from "./game_object";
import { EpochSeconds, currentEpochSeconds } from "./utils";
import { HeartbeatAction, Action } from "./action";

export interface Player extends GameObject {
  gqlName: "Player";
  colorHex: string;
  name: string;
  lastHeartbeat: EpochSeconds | null;
  isConnected: boolean;
  playerNum: number;
}

export function create(
  fields: Pick<Player, "name" | "gameId" | "playerNum"> & Partial<Player>
): Player {
  const { gameId, name, playerNum } = fields;
  return {
    gqlName: "Player",
    gameId,
    key: `players.${playerNum}`,
    colorHex: "#000000",
    name,
    lastHeartbeat: null,
    isConnected: false,
    playerNum,
  };
}

const HEARTBEAT_TIMEOUT: EpochSeconds = 7;

export const playerReducer = produce((draft: Player, action: Action) => {
  const now = currentEpochSeconds();
  if (action.type === "Heartbeat") {
    const heartbeatAction = action as HeartbeatAction;
    if (heartbeatAction.playerNum === draft.playerNum) {
      draft.lastHeartbeat = now;
    }
  }
  draft.isConnected =
    !!draft.lastHeartbeat && now - draft.lastHeartbeat < HEARTBEAT_TIMEOUT;
});
