import * as schema from "@nexus/schema";

import * as roomCodeApi from "../api/room_code";

export const RoomCodeGQL = schema.objectType({
  name: "RoomCode",
  definition(t) {
    t.string("gameId");
    t.string("code");
  },
});

export const Query = schema.extendType({
  type: "Query",
  definition(t) {
    t.field("roomCode", {
      type: RoomCodeGQL,
      args: {
        code: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await roomCodeApi.fetch(args.code, ctx.redis);
        return game || null;
      },
    });
  },
});
