import * as schema from "@nexus/schema";

import * as action from "../api/action";
import * as gameApi from "../api/game";
import * as playerApi from "../api/player";
import { PlayerGQL } from "./player_schema";
import { NodeGQL } from "./node_schema";

export const GameGQL = schema.objectType({
  name: "Game",
  rootTyping: { path: "../api/game", name: "Game" },
  definition(t) {
    t.implements(NodeGQL);
    t.id("id");
    t.string("name");
    t.int("numPlayers", {
      async resolve(root) {
        return root.players.length;
      },
    });
    t.list.field("players", {
      type: PlayerGQL,
      async resolve(root, _args, _ctx) {
        return root.players;
      },
    });
  },
});

export const Query = schema.extendType({
  type: "Query",
  definition(t) {
    t.field("game", {
      type: GameGQL,
      args: {
        id: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await gameApi.fetch(ctx.redis, args.id);
        return game || null;
      },
    });
  },
});

export const Mutation = schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGame", {
      type: GameGQL,
      nullable: false,
      args: {
        name: schema.stringArg(),
      },
      async resolve(_root, args, ctx) {
        const game = gameApi.create({
          name: args.name || "No name",
        });
        gameApi.save(game, ctx.redis);
        return game;
      },
    });

    t.field("joinGameAsPlayer", {
      type: GameGQL,
      description:
        "Creates a new player, adds the player to a game, and sets the player cookie.",
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId } = args;
        const player = playerApi.create({ name: args.name });
        const game = await gameApi.dispatchAction(
          gameId,
          action.playerJoin(player),
          ctx.redis
        );
        ctx.response.cookie("player", player.id, { maxAge: 86400000 });
        return game;
      },
    });

    t.field("startGame", {
      type: GameGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId } = args;
        return await gameApi.dispatchAction(
          gameId,
          action.gameStart(),
          ctx.redis
        );
      },
    });
  },
});
