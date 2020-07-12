import * as schema from "@nexus/schema";

import * as action from "../api/action";
import * as gameApi from "../api/game";
import * as playerApi from "../api/player";
import * as roomCodeApi from "../api/room_code";
import { PlayerGQL } from "./player_schema";
import { GameObjectGQL } from "./game_object_schema";
import { ExpectedActionsGQL } from "./action_schema";
import { BoardGQL } from "./board_schema";

export const GameGQL = schema.objectType({
  name: "Game",
  rootTyping: { path: "../api/game", name: "Game" },
  definition(t) {
    t.implements(GameObjectGQL);
    t.id("gameId");
    t.string("key");
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
    t.field("expectedActions", { type: ExpectedActionsGQL });
    t.field("board", { type: BoardGQL });
  },
});

export const GameAndPlayerPayloadGQL = schema.objectType({
  name: "GameAndPlayer",
  definition(t) {
    t.field("game", { type: GameGQL });
    t.field("player", { type: PlayerGQL });
  },
});

export const CreateGamePayloadGQL = schema.objectType({
  name: "CreateGamePayload",
  definition(t) {
    t.field("game", { type: GameGQL });
    t.string("roomCode");
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
        const game = await gameApi.fetch(args.id, ctx.redis);
        return game || null;
      },
    });
  },
});

export const Mutation = schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("createGame", {
      type: CreateGamePayloadGQL,
      nullable: false,
      args: {
        name: schema.stringArg(),
      },
      async resolve(_root, args, ctx) {
        const game = gameApi.create({
          name: args.name || "No name",
        });
        gameApi.save(game, ctx.redis);
        const roomCode = await roomCodeApi.create(
          { gameId: game.gameId },
          ctx.redis
        );
        await roomCodeApi.save(roomCode, ctx.redis);
        return { game, roomCode: roomCode.code };
      },
    });

    t.field("joinGameAsPlayer", {
      type: GameAndPlayerPayloadGQL,
      description: "Creates a new player and adds the player to a game.",
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        const { gameId } = args;
        const game = await gameApi.fetch(gameId, ctx.redis);
        const playerNum = game.players.length;
        const player = playerApi.create({ name: args.name, playerNum, gameId });
        await gameApi.dispatchAction(
          gameId,
          action.playerJoin(player),
          playerNum,
          ctx
        );
        return { game, player };
      },
    });

    t.field("heartbeat", {
      type: GameGQL,
      nullable: false,
      args: {
        gameId: schema.idArg({ required: true }),
        playerNum: schema.intArg(),
      },
      async resolve(_root, args, ctx) {
        const game = await gameApi.dispatchAction(
          args.gameId,
          action.heartbeat(args.playerNum ?? null),
          null,
          ctx
        );
        gameApi.save(game, ctx.redis);
        return game;
      },
    });
  },
});
