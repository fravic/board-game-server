import * as schema from "@nexus/schema";

import { actionType } from "../api/action";
import { GameObjectGQL } from "./game_object_schema";

export const ActionTypeGQL = schema.enumType({
  name: "ActionType",
  members: actionType,
});

export const ExpectedActionGQL = schema.objectType({
  name: "ExpectedAction",
  rootTyping: { path: "../api/action", name: "ExpectedAction" },
  definition(t) {
    t.field("type", { type: ActionTypeGQL, nullable: true });
    t.int("actorPlayerNum", { nullable: true });
  },
});

export const ExpectedActionsGQL = schema.objectType({
  name: "ExpectedActions",
  rootTyping: { path: "../api/action", name: "ExpectedActions" },
  definition(t) {
    t.implements(GameObjectGQL);
    t.id("gameId");
    t.string("key");
    t.list.field("actions", { type: ExpectedActionGQL });
  },
});
