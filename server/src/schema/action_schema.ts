import * as schema from "@nexus/schema";

import { actionType } from "../api/action";

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
