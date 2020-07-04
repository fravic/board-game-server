import * as schema from "@nexus/schema";

import * as action from "../api/action";
import * as gameApi from "../api/game";
import { GameGQL } from "./game_schema";
import { NodeGQL } from "./node_schema";

export const PlayerGQL = schema.objectType({
  name: "Player",
  rootTyping: { path: "../api/player", name: "Player" },
  definition(t) {
    t.implements(NodeGQL);
    t.id("id");
    t.string("name");
  },
});

export const Mutation = schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("playerHeartbeat", {
      type: GameGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        playerId: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await gameApi.dispatchAction(
          args.gameId,
          action.heartbeat(args.playerId),
          ctx.redis
        );
        gameApi.save(game, ctx.redis);
        return game;
      },
    });
  },
});
