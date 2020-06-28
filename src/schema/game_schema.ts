import * as schema from "@nexus/schema";

import { Game } from "../models/game";
import { Player } from "../models/player";
import { PlayerGQL } from "./player_schema";

export const GameGQL = schema.objectType({
  name: "Game",
  rootTyping: { path: "../models/game", name: "Game" },
  definition(t) {
    t.id("id"),
      t.string("name"),
      t.int("numPlayers"),
      t.list.field("players", {
        type: PlayerGQL,
        async resolve(root, _args, _ctx) {
          return root.players;
        },
      });
  },
});
