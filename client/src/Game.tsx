import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Board } from "./Board";
import { JoinAsPlayerForm } from "./JoinAsPlayerForm";
import { boardFragmentGql } from "./fragments";

import { Game as GameQuery } from "./gql_types/Game";
import { GameEvents, GameEventsVariables } from "./gql_types/GameEvents";
import { Heartbeat, HeartbeatVariables } from "./gql_types/Heartbeat";

export const playerFragment = gql`
  fragment playerFragment on Player {
    id
    name
    isConnected
    colorHex
  }
`;

export const gameFragment = gql`
  fragment gameFragment on Game {
    id
    name
    players {
      ...playerFragment
    }
    expectedActions {
      type
      actorId
    }
    board {
      ...boardFragment
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
  ${playerFragment}
  ${boardFragmentGql}
`;

export const gameEventsSubscriptionGql = gql`
  subscription GameEvents($gameId: ID!) {
    gameEvents(gameId: $gameId) {
      changedNodes {
        id
        ... on Game {
          ...gameFragment
        }
        ... on Player {
          ...playerFragment
        }
        ... on Board {
          ...boardFragment
        }
      }
    }
  }
  ${gameFragment}
  ${playerFragment}
  ${boardFragmentGql}
`;

export const heartbeatMutationGql = gql`
  mutation Heartbeat($gameId: ID!, $playerId: ID) {
    heartbeat(gameId: $gameId, playerId: $playerId) {
      id
    }
  }
`;

type PropsType = {};

export function Game(props: PropsType) {
  const { gameId } = useParams();
  const { data } = useQuery<GameQuery>(gameQueryGql, {
    variables: { id: gameId },
  });
  const game = data?.game;

  const { error } = useSubscription<GameEvents, GameEventsVariables>(
    gameEventsSubscriptionGql,
    {
      variables: { gameId: gameId },
    }
  );

  const [playerId, setPlayerId] = React.useState<string | null>(null);

  const disconnectedPlayers = (game?.players || []).filter(
    (p) => !p.isConnected
  );

  const [heartbeat] = useMutation<Heartbeat, HeartbeatVariables>(
    heartbeatMutationGql
  );
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameId) {
        heartbeat({ variables: { playerId, gameId } });
      }
    }, 2500);
    return () => {
      clearInterval(interval);
    };
  }, [gameId, heartbeat, playerId]);

  return (
    <div>
      Game Id: {gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {game?.players.map((p: { name: string }) => p.name)}
      <br />
      {playerId === null && (
        <JoinAsPlayerForm
          gameId={gameId}
          onSetPlayerId={setPlayerId}
          disconnectedPlayers={disconnectedPlayers}
          acceptingNewPlayers={Boolean(
            game &&
              game.expectedActions.length &&
              game.expectedActions.find((ex) => ex.type === "PlayerJoin")
          )}
        />
      )}
      {game?.board && (
        <Board
          board={game?.board}
          currentPlayerId={playerId}
          gameId={gameId}
          players={game?.players}
        />
      )}
      {game?.board.winningPlayerId && (
        <div>{game?.board.winningPlayerId} wins!</div>
      )}
      {error && error.toString()}
    </div>
  );
}
