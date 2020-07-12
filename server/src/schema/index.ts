import { makeSchema } from "@nexus/schema";
import path from "path";

import * as boardSchema from "./board_schema";
import * as eventSchema from "./game_event_schema";
import * as gameSchema from "./game_schema";
import * as gameObjectSchema from "./game_object_schema";
import * as playerSchema from "./player_schema";
import * as roomCodeSchema from "./room_code_schema";

export const schema = makeSchema({
  types: [
    boardSchema,
    eventSchema,
    gameSchema,
    gameObjectSchema,
    playerSchema,
    roomCodeSchema,
  ],
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
