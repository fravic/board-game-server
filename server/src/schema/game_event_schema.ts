import { objectType, subscriptionField, idArg } from "@nexus/schema";

import { GameObjectGQL } from "./game_object_schema";

export const GameEventGQL = objectType({
  name: "GameEvent",
  definition(t) {
    t.list.field("changed", { type: GameObjectGQL });
  },
});

export const GameEventSubscriptionGQL = subscriptionField("gameEvents", {
  type: GameEventGQL,
  args: {
    gameId: idArg({ required: true }),
  },
  subscribe(_root, args, ctx) {
    return ctx.redis.pubsub.asyncIterator(args.gameId);
  },
  async resolve(payload, _args, _ctx) {
    return JSON.parse(payload);
  },
});
