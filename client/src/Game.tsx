import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Board } from "./Board";
import { JoinGameModal } from "./JoinGameModal/";
import { boardFragmentGql } from "./fragments";
import { isPlayerNum } from "./utils";

import { Game as GameQuery, Game_game as GameFragment } from "./gql_types/Game";
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

export const expectedActionsFragmentGql = gql`
  fragment expectedActionsFragment on ExpectedActions {
    key
    actions {
      type
      actorPlayerNum
    }
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
      ...expectedActionsFragment
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
  ${expectedActionsFragmentGql}
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
        ... on ExpectedActions {
          ...expectedActionsFragment
        }
      }
    }
  }
  ${gameFragment}
  ${playerFragment}
  ${boardFragmentGql}
  ${expectedActionsFragmentGql}
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
  const disconnectedPlayerCount = disconnectedPlayers.length;

  const [heartbeat] = useMutation<Heartbeat, HeartbeatVariables>(
    heartbeatMutationGql
  );
  useEffect(() => {
    heartbeat({ variables: { playerNum, gameId } });

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

  const [joinGameModalDismissed, setJoinGameModalDismissed] = React.useState(
    false
  );
  useEffect(() => {
    if (disconnectedPlayerCount > 0) {
      setJoinGameModalDismissed(false);
    }
  }, [disconnectedPlayerCount]);

  return (
    <div>
      Game Id: {gameId}
      <br />
      Name: {data?.game?.name}
      <br />
      Players: {game?.players.map((p: { name: string }) => p.name)}
      <br />
      {playerNum === null && !joinGameModalDismissed && (
        <JoinGameModal
          gameId={gameId}
          onDismiss={() => setJoinGameModalDismissed(true)}
          onSetPlayerNum={setPlayerNum}
          disconnectedPlayers={disconnectedPlayers}
          acceptingNewPlayers={Boolean(
            game &&
              game.expectedActions.actions.length &&
              game.expectedActions.actions.find(
                (ex) => ex.type === "PlayerJoin"
              )
          )}
        />
      )}
      {game?.board && (
        <Board
          board={game?.board}
          currentPlayerNum={playerNum}
          gameId={gameId}
          isCurrentPlayerTurn={isCurrentPlayerTurn(game, playerNum)}
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

function isCurrentPlayerTurn(
  game: GameFragment | null | undefined,
  playerNum: number | null
): boolean {
  return (
    !!game &&
    !!game.expectedActions.actions.length &&
    game.expectedActions.actions.find(
      (ex) => ex.type === "DropPiece" && ex.actorPlayerNum === playerNum
    ) !== undefined
  );
}
