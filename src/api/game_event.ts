import { Game, gameApi } from "./game";
import { NexusGenAbstractResolveReturnTypes } from "../schema/types.generated";
import { Player } from "./player";
import { Redis } from "../redis";

type GameEventGQLName = NexusGenAbstractResolveReturnTypes["GameEvent"];

export type GameEvent = {
  gameId: string;
  gqlName: GameEventGQLName;
};

export const gameEventApi = {
  // Publish the event to subscribers
  async publish(gameEvent: GameEvent, redis: Redis) {
    await redis.pubsub.publish(gameEvent.gameId, JSON.stringify(gameEvent));
  },

  processAndPublish: {
    async playerJoined(
      gameId: string,
      player: Player,
      redis: Redis
    ): Promise<Game> {
      const game = await gameApi.fetch(redis, gameId);
      game.players.push(player);
      await gameApi.save(game, redis);
      const gameEvent: GameEvent = {
        gameId: game.id,
        gqlName: "PlayerJoinedEvent",
      };
      await gameEventApi.publish(gameEvent, redis);
      return game;
    },

    async gameStarted(gameId: string, redis: Redis) {
      const game = await gameApi.fetch(redis, gameId);
      // TODO: Kick off the game
      await gameApi.save(game, redis);
      const gameEvent: GameEvent = {
        gameId: game.id,
        gqlName: "GameStartedEvent",
      };
      await gameEventApi.publish(gameEvent, redis);
      return game;
    },
  },
};
