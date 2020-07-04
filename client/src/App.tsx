import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

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
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/game/:gameId" component={Game} />
          <Route path="*" component={Lobby} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}
