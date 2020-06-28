import { makeSchema } from "@nexus/schema";
import path from "path";

import { ActionsSubscriptionGQL } from "./action_schema";
import { Mutation } from "./mutation";
import { Query } from "./query";

export const schema = makeSchema({
  types: [Query, Mutation, ActionsSubscriptionGQL],
  typegenAutoConfig: {
    sources: [
      { source: path.join(__dirname, "../context.ts"), alias: "context" },
    ],
    contextType: "context.Context",
  },
  outputs: {
    schema: path.join(__dirname, "./schema.generated.graphql"),
    typegen: path.join(__dirname, "./types.generated.d.ts"),
  },
});
