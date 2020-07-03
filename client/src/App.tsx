import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import React from "react";

import { Game } from "./Game";
import { Lobby } from "./Lobby";

const DEFAULT_ENDPOINT = "ws://localhost:4000";
function createApolloLink(endpoint?: string) {
  const client = new SubscriptionClient(endpoint || DEFAULT_ENDPOINT, {
    reconnect: true,
  });
  return new WebSocketLink(client);
}

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache: cache,
  link: createApolloLink(),
});

export function App() {
  const [gameId, setGameId] = React.useState<string | null>(null);
  return (
    <ApolloProvider client={client}>
      {gameId ? <Game gameId={gameId} /> : <Lobby onSetGameId={setGameId} />}
    </ApolloProvider>
  );
}
