import { Request, Response } from "express";

import { redis, Redis } from "./redis";

export type Context = {
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
}) => ({ redis, request, response } as Context);
