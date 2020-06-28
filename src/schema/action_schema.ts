import { objectType, subscriptionField } from "@nexus/schema";

import { Game } from "../models/game";
import { GameGQL } from "./game_schema";
import { PlayerGQL } from "./player_schema";

export const ActionGQL = objectType({
  name: "Action",
  definition(t) {
    t.string("type");
  },
});

export const ActionSubscriptionPayloadGQL = objectType({
  name: "ActionSubscriptionPayload",
  definition(t) {
    t.field("game", {
      type: GameGQL,
    });
    t.field("action", {
      type: ActionGQL,
    });
  },
});

const ACTIONS_TOPIC = "actions";
export const ActionsSubscriptionGQL = subscriptionField("actions", {
  type: ActionSubscriptionPayloadGQL,
  subscribe(_root, _args, ctx) {
    return ctx.redis.pubsub.asyncIterator(ACTIONS_TOPIC);
  },
  async resolve(payload, _args, ctx) {
    const game = await Game.fetch(ctx.redis, payload.gameId);
    return { game, action: { type: payload.type } };
  },
});
