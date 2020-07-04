import { useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router-dom";

const gameQueryGql = gql`
  query Game($id: ID!) {
    game(id: $id) {
      id
      name
      players {
        name
      }
    }
  }
`;

const gameEventsSubscriptionGql = gql`
  subscription GameEvents($gameId: ID!) {
    gameEvents(gameId: $gameId) {
      changedNodes {
        id
        ... on Game {
          players {
            name
          }
        }
      }
    }
  }
`;

type PropsType = {};

export function Game(props: PropsType) {
  const { gameId } = useParams();
  const { data } = useQuery(gameQueryGql, {
    variables: { id: gameId },
  });
  const { error } = useSubscription(gameEventsSubscriptionGql, {
    variables: { gameId: gameId },
  });
  return (
    <div>
      Game Id: {gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {data?.game?.players.map((p: { name: string }) => p.name)}
      <br />
      {error && error.toString()}
    </div>
  );
}
