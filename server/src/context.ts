import { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";

import { redis, Redis } from "./redis";

const pubsub = new PubSub();

export type Context = {
  pubsub: PubSub;
  redis: Redis;
  request: Request;
  response: Response;
};

export const context = ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => ({ pubsub, redis, request, response } as Context);
