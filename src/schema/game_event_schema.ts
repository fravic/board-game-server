import {
  interfaceType,
  objectType,
  subscriptionField,
  idArg,
} from "@nexus/schema";

import { Game } from "../models/game";
import { GameEvent } from "../models/game_event";
import { GameGQL } from "./game_schema";

export const GameEventGQL = interfaceType({
  name: "GameEvent",
  rootTyping: { path: "../models/game_event", name: "GameEvent" },
  definition(t) {
    t.field("game", {
      type: GameGQL,
      resolve(root, _args, ctx) {
        return Game.fetch(ctx.redis, root.gameId);
      },
    });
    t.resolveType((root) => {
      return root.gqlName;
    });
  },
});

function defineGenericGameEvent(name: string) {
  return objectType({
    name,
    definition(t) {
      t.implements(GameEventGQL);
    },
  });
}

export const PlayerJoinedEventGQL = defineGenericGameEvent("PlayerJoinedEvent");
export const GameStartedEventGQL = defineGenericGameEvent("GameStartedEvent");

export const GameEventSubscriptionGQL = subscriptionField("gameEvents", {
  type: GameEventGQL,
  args: {
    gameId: idArg({ required: true }),
  },
  subscribe(_root, args, ctx) {
    return ctx.redis.pubsub.asyncIterator(args.gameId);
  },
  async resolve(payload, _args, ctx) {
    return GameEvent.rehydrate(ctx.redis, payload);
  },
});
