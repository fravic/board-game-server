import { redis, Redis } from "./redis";

export type Context = {
  redis: Redis;
};

export const context = { redis } as Context;
