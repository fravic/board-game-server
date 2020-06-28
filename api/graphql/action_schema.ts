import { objectType, subscriptionField } from "nexus/components/schema";

import { GameGQL } from "./game_schema";
import { PlayerGQL } from "./player_schema";

const ActionGQL = objectType({
  name: "Action",
  definition(t) {
    t.field("actor", {
      type: PlayerGQL,
    });
    t.string("type");
  },
});

const ActionSubscriptionPayloadGQL = objectType({
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
subscriptionField("actions", {
  type: ActionSubscriptionPayloadGQL,
  subscribe(root, args, ctx) {
    return ctx.redis.pubsub.asyncIterator(ACTIONS_TOPIC);
  },
  resolve(payload) {
    return payload;
  },
});
