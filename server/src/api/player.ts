import { v4 as uuid } from "uuid";

import { Node } from "./node";
import { EpochSeconds } from "./utils";

export interface Player extends Node {
  name: string;
  lastHeartbeat: EpochSeconds | null;
}

export function create(fields: Pick<Player, "name"> & Partial<Player>): Player {
  const { id, name } = fields;
  return {
    id: id ?? uuid(),
    gqlName: "Player",
    name,
    lastHeartbeat: null,
  };
}
