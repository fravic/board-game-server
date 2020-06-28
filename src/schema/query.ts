import { idArg, queryType } from "@nexus/schema";

import { Game } from "../models/game";
import { GameGQL } from "./game_schema";

export const Query = queryType({
  definition(t) {
    t.field("game", {
      type: GameGQL,
      args: {
        id: idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await Game.fetch(ctx.redis, args.id);
        return game || null;
      },
    });
  },
});
