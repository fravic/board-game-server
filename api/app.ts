import { schema } from "nexus";

import { redis } from "./redis";

schema.addToContext(() => {
  return {
    redis,
  };
});
