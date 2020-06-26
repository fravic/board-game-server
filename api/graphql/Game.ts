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
        id: schema.idArg(),
      },
      resolve(_root, args, ctx) {
        const game = ctx.db.games.find((g) => g.id === args.id);
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
      resolve(_root, args, ctx) {
        const newGame = {
          id: `${ctx.db.games.length + 1}`,
          name: args.name || "No name",
        };
        ctx.db.games.push(newGame);
        return newGame;
      },
    });
  },
});
