import _redis from "redis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { promisify } from "util";

const DEFAULT_REDIS_PORT = 6379;
const redisClient = _redis.createClient({
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT)
    : DEFAULT_REDIS_PORT,
});

const subscriptionClient = _redis.createClient({
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT)
    : DEFAULT_REDIS_PORT,
});
const pubsub = new RedisPubSub({
  publisher: subscriptionClient,
  subscriber: subscriptionClient,
});

export const redis = {
  get: promisify(redisClient.get).bind(redisClient),
  set: promisify(redisClient.set).bind(redisClient),
  pubsub,
};

export type Redis = typeof redis;
