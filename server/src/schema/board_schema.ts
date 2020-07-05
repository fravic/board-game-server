import * as schema from "@nexus/schema";

import { NodeGQL } from "./node_schema";
import * as action from "../api/action";
import * as gameApi from "../api/game";

export const BoardPieceGQL = schema.objectType({
  name: "BoardPiece",
  definition(t) {
    t.string("playerId", {
      nullable: true,
      description:
        "The player who owns this piece, or null if the piece is not owned",
    });
  },
});

export const BoardColumnGQL = schema.objectType({
  name: "BoardColumn",
  definition(t) {
    t.list.field("pieces", { type: BoardPieceGQL });
  },
});

export const BoardGQL = schema.objectType({
  name: "Board",
  rootTyping: { path: "../api/board", name: "Board" },
  definition(t) {
    t.implements(NodeGQL);
    t.id("id");
    t.list.field("columns", { type: BoardColumnGQL });
    t.id("winningPlayerId", {
      nullable: true,
      description: "If set, the id of the player who has won the game.",
    });
  },
});

export const Mutation = schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("dropPiece", {
      type: BoardGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        playerId: schema.idArg({ required: true }),
        column: schema.intArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId, playerId, column } = args;
        const game = await gameApi.dispatchAction(
          gameId,
          action.dropPiece(playerId, column),
          playerId,
          ctx.redis
        );
        return game.board;
      },
    });
  },
});
