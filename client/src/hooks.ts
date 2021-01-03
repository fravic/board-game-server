import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useCallback } from 'react';

import { Game_game as GameFragment } from "./gql_types/Game";

import {
  JoinGameAsPlayer,
  JoinGameAsPlayerVariables,
} from "./gql_types/JoinGameAsPlayer";

export const joinGameAsPlayerMutationGql = gql`
  mutation JoinGameAsPlayer($gameId: ID!, $name: String!) {
    joinGameAsPlayer(gameId: $gameId, name: $name) {
      player {
        playerNum
      }
    }
  }
`;

// Set the player number via query param + mutation, if necessary
// Name is taken from query param, for RocketCrab support
export function usePlayerNumber(game: GameFragment | null | undefined, nameQueryParam: string | null, acceptingNewPlayers: boolean): [number | null, (playerNum: number) => void] {
  const [playerNum, setPlayerNum] = React.useState<number | null>(null);
  const [_joinGameAsPlayer] = useMutation<
    JoinGameAsPlayer,
    JoinGameAsPlayerVariables
  >(joinGameAsPlayerMutationGql);
  const joinGame = useCallback(async () => {
    console.log(`Joining game as player ${nameQueryParam}`);
    if (!game || !nameQueryParam) {
      throw new Error('Invalid variables to join game');
    }
    const res = await _joinGameAsPlayer({
      variables: { gameId: game.gameId, name: nameQueryParam },
    });
    const playerNum = res.data?.joinGameAsPlayer.player.playerNum;
    if (playerNum === undefined) {
      throw new Error("Error getting playerNum from server");
    }
    setPlayerNum(playerNum);
  }, [game, _joinGameAsPlayer, setPlayerNum, nameQueryParam]);

  useEffect(() => {
    if (game && playerNum === null && nameQueryParam) {
      const playerNumInGame = game.players.findIndex(p => p.name === nameQueryParam);
      if (playerNumInGame >= 0) {
        console.log(`Re-joining game as player ${nameQueryParam}`);
        setPlayerNum(playerNumInGame);
      } else if (acceptingNewPlayers) {
        joinGame();
      }
    }
  }, [acceptingNewPlayers, joinGame, game, playerNum, nameQueryParam]);

  return [playerNum, setPlayerNum];
}