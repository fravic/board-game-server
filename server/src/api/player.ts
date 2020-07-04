import { v4 as uuid } from "uuid";

import { Node } from "./node";

export interface Player extends Node {
  name: string;
}

export function create(fields: Pick<Player, "name"> & Partial<Player>): Player {
  const { id, name } = fields;
  return {
    id: id ?? uuid(),
    gqlName: "Player",
    name,
  };
}
