import { schema } from "nexus";

schema.objectType({
  name: "Player",
  rootTyping: "Player",
  definition(t) {
    t.string("name");
  },
});
