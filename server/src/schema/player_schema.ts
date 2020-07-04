import * as schema from "@nexus/schema";

import { NodeGQL } from "./node_schema";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: { path: "../api/player", name: "Player" },
  definition(t) {
    t.implements(NodeGQL);
    t.id("id");
    t.string("name");
  },
});
