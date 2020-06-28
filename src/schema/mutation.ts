import { idArg, intArg, mutationType, stringArg } from "@nexus/schema";

import { Game } from "../models/game";
import { GameGQL } from "./game_schema";
import { Player } from "../models/player";
import { PlayerGQL } from "./player_schema";

export const Mutation = mutationType({
  definition(t) {
    t.field("createGame", {
      type: GameGQL,
      nullable: false,
      args: {
        name: stringArg(),
        numPlayers: intArg({ required: true }),
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

    t.field("addPlayerToGame", {
      type: PlayerGQL,
      nullable: false,
      args: {
        gameId: idArg({ required: true }),
        name: stringArg({ required: true }),
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
