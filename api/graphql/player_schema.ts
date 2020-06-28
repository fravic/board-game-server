import { schema } from "nexus";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: "Player",
  definition(t) {
    t.string("name");
  },
});
