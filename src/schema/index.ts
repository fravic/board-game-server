import { makeSchema } from "@nexus/schema";
import path from "path";

import * as eventSchema from "./game_event_schema";
import * as gameSchema from "./game_schema";
import * as playerSchema from "./player_schema";

export const schema = makeSchema({
  types: [eventSchema, gameSchema, playerSchema],
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
