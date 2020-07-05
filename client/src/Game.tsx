import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Board } from "./Board";
import { JoinAsPlayerForm } from "./JoinAsPlayerForm";
import { boardFragmentGql } from "./fragments";
import { isPlayerNum } from "./utils";

import { Game as GameQuery } from "./gql_types/Game";
import { GameEvents, GameEventsVariables } from "./gql_types/GameEvents";
import { Heartbeat, HeartbeatVariables } from "./gql_types/Heartbeat";

export const playerFragment = gql`
  fragment playerFragment on Player {
    key
    playerNum
    name
    isConnected
    colorHex
  }
`;

export const gameFragment = gql`
  fragment gameFragment on Game {
    gameId
    name
    key
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
      changed {
        gameId
        key
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
  mutation Heartbeat($gameId: ID!, $playerNum: Int) {
    heartbeat(gameId: $gameId, playerNum: $playerNum) {
      gameId
    }
  }
`;

export const resetBoardMutationGql = gql`
  mutation ResetBoard($gameId: ID!) {
    resetBoard(gameId: $gameId) {
      ...boardFragment
    }
  }
  ${boardFragmentGql}
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

  const [playerNum, setPlayerNum] = React.useState<number | null>(null);

  const disconnectedPlayers = (game?.players || []).filter(
    (p) => !p.isConnected
  );

  const [heartbeat] = useMutation<Heartbeat, HeartbeatVariables>(
    heartbeatMutationGql
  );
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameId) {
        heartbeat({ variables: { playerNum, gameId } });
      }
    }, 2500);
    return () => {
      clearInterval(interval);
    };
  }, [gameId, heartbeat, playerNum]);

  const [resetBoard] = useMutation(resetBoardMutationGql);
  const handleResetBoardClick = useCallback(async () => {
    await resetBoard({ variables: { gameId } });
  }, [gameId, resetBoard]);

  return (
    <div>
      Game Id: {gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {game?.players.map((p: { name: string }) => p.name)}
      <br />
      {playerNum === null && (
        <JoinAsPlayerForm
          gameId={gameId}
          onSetPlayerNum={setPlayerNum}
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
          currentPlayerNum={playerNum}
          gameId={gameId}
          players={game?.players}
        />
      )}
      {isPlayerNum(game?.board.winningPlayerNum) && (
        <div>
          {game?.board.winningPlayerNum} wins!{" "}
          <button onClick={handleResetBoardClick}>Play again</button>
        </div>
      )}
      {error && error.toString()}
    </div>
  );
}
