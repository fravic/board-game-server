import { produce } from "immer";
import { v4 as uuid } from "uuid";

import { Node } from "./node";
import { EpochSeconds, currentEpochSeconds } from "./utils";
import { HeartbeatAction, Action } from "./action";

export interface Player extends Node {
  gqlName: "Player";
  name: string;
  lastHeartbeat: EpochSeconds | null;
  isConnected: boolean;
}

export function create(fields: Pick<Player, "name"> & Partial<Player>): Player {
  const { id, name } = fields;
  return {
    id: id ?? uuid(),
    gqlName: "Player",
    name,
    lastHeartbeat: null,
    isConnected: false,
  };
}

const HEARTBEAT_TIMEOUT: EpochSeconds = 7;

export const playerReducer = produce((draft: Player, action: Action) => {
  const now = currentEpochSeconds();
  if (action.type === "Heartbeat") {
    const heartbeatAction = action as HeartbeatAction;
    if (heartbeatAction.playerId === draft.id) {
      draft.lastHeartbeat = now;
    }
  }
  draft.isConnected =
    !!draft.lastHeartbeat && now - draft.lastHeartbeat < HEARTBEAT_TIMEOUT;
});
