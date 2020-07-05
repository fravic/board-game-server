import * as schema from "@nexus/schema";

import { GameObjectGQL } from "./game_object_schema";
import * as action from "../api/action";
import * as gameApi from "../api/game";

export const BoardPieceGQL = schema.objectType({
  name: "BoardPiece",
  definition(t) {
    t.int("playerNum", {
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
    t.implements(GameObjectGQL);
    t.id("gameId");
    t.string("key");
    t.list.field("columns", { type: BoardColumnGQL });
    t.int("winningPlayerNum", {
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
        playerNum: schema.intArg({ required: true }),
        column: schema.intArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId, playerNum, column } = args;
        const game = await gameApi.dispatchAction(
          gameId,
          action.dropPiece(playerNum, column),
          playerNum,
          ctx.redis
        );
        return game.board;
      },
    });

    t.field("resetBoard", {
      type: BoardGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId } = args;
        const game = await gameApi.dispatchAction(
          gameId,
          action.resetBoard(),
          null,
          ctx.redis
        );
        return game.board;
      },
    });
  },
});
