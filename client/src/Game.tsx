import { useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

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

type PropsType = {
  gameId: string;
};

export function Game(props: PropsType) {
  const { data } = useQuery(gameQueryGql, {
    variables: { id: props.gameId },
  });
  const { error } = useSubscription(gameEventsSubscriptionGql, {
    variables: { gameId: props.gameId },
  });
  return (
    <div>
      Game Id: {props.gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {data?.game?.players.map((p: { name: string }) => p.name)}
      <br />
      {error && error.toString()}
    </div>
  );
}
