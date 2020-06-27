import _redis from "redis";
import { promisify } from "util";

const DEFAULT_REDIS_PORT = 6379;
const redisClient = _redis.createClient({
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT)
    : DEFAULT_REDIS_PORT,
});

export const redis = {
  get: promisify(redisClient.get).bind(redisClient),
  set: promisify(redisClient.set).bind(redisClient),
};

export type Redis = typeof redis;
