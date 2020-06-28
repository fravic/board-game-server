import _redis from "redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { promisify } from "util";

const DEFAULT_REDIS_PORT = 6379;
const port = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : DEFAULT_REDIS_PORT;

function createRedisClient() {
  return _redis.createClient({
    port,
  });
}

const defaultRedisClient = createRedisClient();

const pubsub = new RedisPubSub({
  publisher: createRedisClient(),
  subscriber: createRedisClient(),
});

export const redis = {
  get: promisify(defaultRedisClient.get).bind(defaultRedisClient),
  set: promisify(defaultRedisClient.set).bind(defaultRedisClient),
  pubsub,
};

export type Redis = typeof redis;
