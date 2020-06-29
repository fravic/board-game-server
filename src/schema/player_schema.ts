import * as schema from "@nexus/schema";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: { path: "../api/player", name: "Player" },
  definition(t) {
    t.string("name");
  },
});
