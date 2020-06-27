import { schema } from "nexus";

schema.objectType({
  name: "Game",
  definition(t) {
    t.id("id"),
      t.string("name"),
      t.int("numPlayers"),
      t.list.field("players", {
        type: "Player",
        resolve(root, _args, ctx) {
          return ctx.db.player.findMany({ where: { gameId: root.id } });
        },
      });
  },
});

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("game", {
      type: "Game",
      args: {
        id: schema.idArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const game = await ctx.db.game.findOne({ where: { id: args.id } });
        return game || null;
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGame", {
      type: "Game",
      nullable: false,
      args: {
        name: schema.stringArg(),
        numPlayers: schema.intArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        return await ctx.db.game.create({
          data: { name: args.name || "No name", numPlayers: args.numPlayers },
        });
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addPlayerToGame", {
      type: "Player",
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const player = await ctx.db.player.create({
          data: { name: args.name, game: { connect: { id: args.gameId } } },
        });
        return player;
      },
    });
  },
});
