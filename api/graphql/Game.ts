import { schema } from "nexus";

schema.objectType({
  name: "Game",
  definition(t) {
    t.id("id"), t.string("name");
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
      },
      async resolve(_root, args, ctx) {
        return await ctx.db.game.create({
          data: { name: args.name || "No name" },
        });
      },
    });
  },
});
