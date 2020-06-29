import { objectType, subscriptionField, idArg } from "@nexus/schema";

import { NodeGQL } from "./node_schema";

export const GameEventGQL = objectType({
  name: "GameEvent",
  definition(t) {
    t.list.field("changedNodes", { type: NodeGQL });
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
