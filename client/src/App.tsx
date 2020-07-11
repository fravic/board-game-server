import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { ModalPortal } from "./components/Modal";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import introspectionQueryResultData from "./gql_types/fragmentTypes.json";
import { theme } from "./components/theme";

const DEFAULT_ENDPOINT = "ws://localhost:4000";
function createApolloLink(endpoint?: string) {
  const client = new SubscriptionClient(endpoint || DEFAULT_ENDPOINT, {
    reconnect: true,
  });
  return new WebSocketLink(client);
}

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
const cache = new InMemoryCache({
  fragmentMatcher,
  // N.B.: This cache assumes that only one game will be active at a time, so we
  // don't need to query for gameId on every GameObject
  dataIdFromObject: (object: any) => object.key || null,
});

const client = new ApolloClient({
  cache: cache,
  link: createApolloLink(),
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <ModalPortal>
          <BrowserRouter>
            <Switch>
              <Route path="/game/:gameId" component={Game} />
              <Route path="*" component={Lobby} />
            </Switch>
          </BrowserRouter>
        </ModalPortal>
      </ApolloProvider>
    </ThemeProvider>
  );
}
