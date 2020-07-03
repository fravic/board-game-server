import { interfaceType } from "@nexus/schema";

export const NodeGQL = interfaceType({
  name: "Node",
  rootTyping: { path: "../api/node", name: "Node" },
  definition(t) {
    t.id("id");
    t.resolveType((root) => {
      return root.gqlName as any;
    });
  },
});
