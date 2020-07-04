import { v4 as uuid } from "uuid";

import { Node } from "./node";
import { EpochSeconds, Reducer, currentEpochSeconds } from "./utils";
import { HeartbeatAction } from "./action";

export interface Player extends Node {
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

const HEARTBEAT_TIMEOUT: EpochSeconds = 7000;

export const playerReducer: Reducer<Player> = (
  player,
  action,
  clientUpdates
) => {
  let next = player;
  const now = currentEpochSeconds();
  if (action.type === "Heartbeat") {
    const heartbeatAction = action as HeartbeatAction;
    if (heartbeatAction.playerId === player.id) {
      next = {
        ...player,
        lastHeartbeat: now,
      };
      clientUpdates.push(next);
    }
  }
  const isConnected =
    !!player.lastHeartbeat && now - player.lastHeartbeat < HEARTBEAT_TIMEOUT;
  if (isConnected !== player.isConnected) {
    next = {
      ...next,
      isConnected,
    };
    clientUpdates.push(next);
  }
  return next;
};
