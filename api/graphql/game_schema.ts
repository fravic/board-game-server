import { schema } from "nexus";

import { Game } from "../models/game";
import { Player } from "../models/player";
import { PlayerGQL } from "./player_schema";

export const GameGQL = schema.objectType({
  name: "Game",
  rootTyping: "Game",
  definition(t) {
    t.id("id"),
      t.string("name"),
      t.int("numPlayers"),
      t.list.field("players", {
        type: PlayerGQL,
        async resolve(root, _args, _ctx) {
          return root.players;
        },
      });
  },
});

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("game", {
      type: GameGQL,
      args: {
        id: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await Game.fetch(ctx.redis, args.id);
        return game || null;
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGame", {
      type: GameGQL,
      nullable: false,
      args: {
        name: schema.stringArg(),
        numPlayers: schema.intArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = new Game({
          name: args.name || "No name",
          numPlayers: args.numPlayers,
        });
        game.save(ctx.redis);
        return game;
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addPlayerToGame", {
      type: PlayerGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const player = new Player(args.name);
        const game = await Game.fetch(ctx.redis, args.gameId);
        game.players.push(player);
        await game.save(ctx.redis);
        return player;
      },
    });
  },
});
