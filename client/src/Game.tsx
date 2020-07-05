import { useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router-dom";

import { JoinAsPlayerForm } from "./JoinAsPlayerForm";

import { Game as GameQuery } from "./gql_types/Game";
import { GameEvents, GameEventsVariables } from "./gql_types/GameEvents";

export const gameFragment = gql`
  fragment gameFragment on Game {
    id
    name
    players {
      id
      name
    }
    expectedActions {
      type
      actorId
    }
  }
`;

export const gameQueryGql = gql`
  query Game($id: ID!) {
    game(id: $id) {
      ...gameFragment
    }
  }
  ${gameFragment}
`;

export const gameEventsSubscriptionGql = gql`
  subscription GameEvents($gameId: ID!) {
    gameEvents(gameId: $gameId) {
      changedNodes {
        id
        ... on Game {
          ...gameFragment
        }
      }
    }
  }
  ${gameFragment}
`;

type PropsType = {};

export function Game(props: PropsType) {
  const { gameId } = useParams();
  const { data } = useQuery<GameQuery>(gameQueryGql, {
    variables: { id: gameId },
  });
  const { error } = useSubscription<GameEvents, GameEventsVariables>(
    gameEventsSubscriptionGql,
    {
      variables: { gameId: gameId },
    }
  );

  const [playerId, setPlayerId] = React.useState<string | null>(null);

  return (
    <div>
      Game Id: {gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {data?.game?.players.map((p: { name: string }) => p.name)}
      <br />
      {playerId === null && (
        <JoinAsPlayerForm gameId={gameId} onSetPlayerId={setPlayerId} />
      )}
      {error && error.toString()}
    </div>
  );
}
