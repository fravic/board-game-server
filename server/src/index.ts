import { GraphQLServer } from "graphql-yoga";

import { context } from "./context";
import { schema } from "./schema";

const server = new GraphQLServer({
  schema,
  context,
});
server.start(
  {
    playground: "/",
  },
  () => console.log("Server is running on http://localhost:4000")
);
