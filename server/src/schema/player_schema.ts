import * as schema from "@nexus/schema";

import * as action from "../api/action";
import * as gameApi from "../api/game";
import { GameGQL } from "./game_schema";
import { NodeGQL } from "./node_schema";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: { path: "../api/player", name: "Player" },
  definition(t) {
    t.implements(NodeGQL);
    t.id("id");
    t.string("name");
    t.boolean("isConnected");
  },
});
