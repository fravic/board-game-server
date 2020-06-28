import { Game } from "./game";
import { NexusGenAbstractResolveReturnTypes } from "../schema/types.generated";
import { Player } from "./player";
import { Redis } from "../redis";

type GameEventGQLName = NexusGenAbstractResolveReturnTypes["GameEvent"];

export abstract class GameEvent {
  gameId: string;
  gqlName: GameEventGQLName;

  constructor(fields: Pick<GameEvent, "gameId" | "gqlName">) {
    this.gameId = fields.gameId;
    if (!fields.gqlName) {
      throw new Error("GameEvent must be created with a GQL name");
    }
    this.gqlName = fields.gqlName;
  }

  static async rehydrate(redis: Redis, serialized: any): Promise<GameEvent> {
    const obj = JSON.parse(serialized);
    const game = await Game.fetch(redis, obj.gameId);
    if (!game) {
      throw new Error(`Game with id ${obj.gameId} not found for action`);
    }
    switch (obj.gqlName as GameEventGQLName) {
      case "PlayerJoinedEvent":
        return new PlayerJoinedEvent({ game, ...obj });
      case "GameStartedEvent":
        return new GameStartedEvent({ game, ...obj });
    }
  }

  // Process and save the effects of the event on its game
  abstract async processAndPublish(redis: Redis): Promise<Game>;

  // Publish the event to subscribers
  async publish(redis: Redis) {
    await redis.pubsub.publish(this.gameId, JSON.stringify(this));
  }
}

export class PlayerJoinedEvent extends GameEvent {
  player: Player;

  constructor(fields: Pick<PlayerJoinedEvent, "gameId" | "player">) {
    super({ ...fields, gqlName: "PlayerJoinedEvent" });
    this.player = fields.player;
  }

  async processAndPublish(redis: Redis) {
    const game = await Game.fetch(redis, this.gameId);
    game.players.push(this.player);
    await game.save(redis);
    await this.publish(redis);
    return game;
  }
}

export class GameStartedEvent extends GameEvent {
  constructor(fields: Pick<GameStartedEvent, "gameId">) {
    super({ ...fields, gqlName: "GameStartedEvent" });
  }

  async processAndPublish(redis: Redis) {
    const game = await Game.fetch(redis, this.gameId);
    // TODO: Kick off the game
    await game.save(redis);
    await this.publish(redis);
    return game;
  }
}
