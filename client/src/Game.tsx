import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Board } from "./Board";
import { Flexbox } from "./components/Flexbox";
import { JoinGameModal } from "./JoinGameModal/";
import { PlayerDisplay } from "./PlayerDisplay/";
import { boardFragmentGql } from "./fragments";

import { Game as GameQuery, Game_game as GameFragment } from "./gql_types/Game";
import { GameEvents, GameEventsVariables } from "./gql_types/GameEvents";
import { Heartbeat, HeartbeatVariables } from "./gql_types/Heartbeat";
import { RoomCode as RoomCodeQuery } from "./gql_types/RoomCode";
import { Spinner } from "./components/Spinner";
import { ToastContext } from "./components/Toast";

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

export const roomCodeQueryGql = gql`
  query RoomCode($code: String!) {
    roomCode(code: $code) {
      gameId
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
  const { roomCode } = useParams();
  const history = useHistory();
  const toastContext = React.useContext(ToastContext);
  const { data: roomCodeData, loading: roomCodeLoading } = useQuery<
    RoomCodeQuery
  >(roomCodeQueryGql, {
    variables: { code: roomCode },
    onError: () => {
      toastContext.showToast("roomCodeError", {
        message: `Sorry, we couldn't find a game with room code ${roomCode}`,
      });
      history.replace("/");
    },
  });
  const gameId = roomCodeData?.roomCode.gameId;
  const { data, loading: gameLoading } = useQuery<GameQuery>(gameQueryGql, {
    variables: { id: gameId },
    skip: !gameId,
  });
  const game = data?.game;

  const { error } = useSubscription<GameEvents, GameEventsVariables>(
    gameEventsSubscriptionGql,
    {
      variables: { gameId: gameId! },
      skip: !gameId,
    }
  );
  useEffect(() => {
    if (error) {
      toastContext.showToast("subscriptionError", {
        message: error.toString(),
      });
    }
  }, [error, toastContext]);

  const [playerNum, setPlayerNum] = React.useState<number | null>(null);

  const disconnectedPlayers = (game?.players || []).filter(p => !p.isConnected);
  const disconnectedPlayerCount = disconnectedPlayers.length;

  const [heartbeat] = useMutation<Heartbeat, HeartbeatVariables>(
    heartbeatMutationGql
  );
  useEffect(() => {
    if (!gameId) {
      return;
    }

    heartbeat({ variables: { playerNum, gameId: gameId! } });

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

  const expectedActorPlayerNums = React.useMemo(
    () => new Set(game?.expectedActions.actions.map(a => a.actorPlayerNum)),
    [game]
  );

  return (
    <>
      <Flexbox>
        <PlayerDisplay
          expectedActorPlayerNums={expectedActorPlayerNums}
          isExpectingAnotherPlayer={isExpectingAnotherPlayer(game)}
          players={game?.players ?? null}
          localPlayerNum={playerNum}
          onResetBoardClick={handleResetBoardClick}
          roomCode={roomCode}
          winningPlayerNum={game?.board.winningPlayerNum ?? null}
        />
        {gameId && game?.board && (
          <Board
            board={game?.board}
            currentPlayerNum={playerNum}
            gameId={gameId}
            isCurrentPlayerTurn={isCurrentPlayerTurn(game, playerNum)}
            players={game?.players}
          />
        )}
        {gameId && playerNum === null && !joinGameModalDismissed && (
          <JoinGameModal
            gameId={gameId}
            onDismiss={() => setJoinGameModalDismissed(true)}
            onSetPlayerNum={setPlayerNum}
            disconnectedPlayers={disconnectedPlayers}
            acceptingNewPlayers={Boolean(
              game &&
                game.expectedActions.actions.length &&
                game.expectedActions.actions.find(
                  ex => ex.type === "PlayerJoin"
                )
            )}
          />
        )}
      </Flexbox>
      {roomCodeLoading || gameLoading ? (
        <Spinner css="width: 100%;">loading</Spinner>
      ) : null}
    </>
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
      ex => ex.type === "DropPiece" && ex.actorPlayerNum === playerNum
    ) !== undefined
  );
}

function isExpectingAnotherPlayer(
  game: GameFragment | null | undefined
): boolean {
  return (
    !!game &&
    !!game.expectedActions.actions.length &&
    game.expectedActions.actions.find(ex => ex.type === "PlayerJoin") !==
      undefined
  );
}
