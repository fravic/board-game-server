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

  // Process an event's effects on a game and then call publish
  async processAndPublish(
    eventFunc: GameEventFuncType,
    gameId: string,
    redis: Redis
  ): Promise<Game> {
    const fetchedGame = await gameApi.fetch(redis, gameId);
    const { game, gameEvent } = await eventFunc(fetchedGame);
    await this.publish(gameEvent, redis);
    return game;
  },
};

type GameEventFuncType = (
  game: Game
) => Promise<{ game: Game; gameEvent: GameEvent }>;

export const gameEvents = {
  playerJoined(player: Player): GameEventFuncType {
    return async (prevGame: Game) => {
      const game = {
        ...prevGame,
        players: [...prevGame.players, player],
      };
      const gameEvent: GameEvent = {
        gameId: game.id,
        gqlName: "PlayerJoinedEvent",
      };
      return { game, gameEvent };
    };
  },

  gameStarted(): GameEventFuncType {
    return async (game: Game) => {
      // TODO: Kick off the game
      const gameEvent: GameEvent = {
        gameId: game.id,
        gqlName: "GameStartedEvent",
      };
      return { game, gameEvent };
    };
  },
};
