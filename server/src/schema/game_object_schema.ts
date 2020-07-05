import { interfaceType } from "@nexus/schema";

export const GameObjectGQL = interfaceType({
  name: "GameObject",
  rootTyping: { path: "../api/game_object", name: "GameObject" },
  definition(t) {
    t.id("gameId");
    t.string("key");
    t.resolveType((root) => {
      return root.gqlName as any;
    });
  },
});
