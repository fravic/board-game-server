import * as schema from "@nexus/schema";

import { GameObjectGQL } from "./game_object_schema";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: { path: "../api/player", name: "Player" },
  definition(t) {
    t.implements(GameObjectGQL);
    t.id("gameId");
    t.string("key");
    t.string("name");
    t.string("colorHex");
    t.boolean("isConnected");
    t.int("playerNum");
  },
});
