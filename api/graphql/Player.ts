import { schema } from "nexus";

schema.objectType({
  name: "Player",
  definition(t) {
    t.id("id"), t.string("name");
  },
});
