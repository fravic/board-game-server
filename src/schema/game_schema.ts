import * as schema from "@nexus/schema";

import { Game } from "../models/game";
import { Player } from "../models/player";
import { PlayerGQL } from "./player_schema";
import {
  GameEvent,
  PlayerJoinedEvent,
  GameStartedEvent,
} from "../models/game_event";

export const GameGQL = schema.objectType({
  name: "Game",
  rootTyping: { path: "../models/game", name: "Game" },
  definition(t) {
    t.id("id");
    t.string("name");
    t.int("numPlayers");
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
        const game = await Game.fetch(ctx.redis, args.id);
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

    t.field("addPlayerToGame", {
      type: GameGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId } = args;
        const player = new Player({ name: args.name });
        const event = new PlayerJoinedEvent({ gameId, player });
        return await event.processAndPublish(ctx.redis);
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
        const event = new GameStartedEvent({ gameId });
        return await event.processAndPublish(ctx.redis);
      },
    });
  },
});