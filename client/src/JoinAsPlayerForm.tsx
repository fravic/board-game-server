import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

import {
  JoinGameAsPlayer,
  JoinGameAsPlayerVariables,
} from "./gql_types/JoinGameAsPlayer";

export const joinGameAsPlayerMutationGql = gql`
  mutation JoinGameAsPlayer($gameId: ID!, $name: String!) {
    joinGameAsPlayer(gameId: $gameId, name: $name) {
      player {
        id
      }
    }
  }
`;

type PropsType = {
  gameId: string;
  onSetPlayerId: (playerId: string) => void;
};

export function JoinAsPlayerForm(props: PropsType) {
  const [playerName, setPlayerName] = React.useState("");
  const [joinGameAsPlayer] = useMutation<
    JoinGameAsPlayer,
    JoinGameAsPlayerVariables
  >(joinGameAsPlayerMutationGql);
  const handleJoinFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await joinGameAsPlayer({
        variables: { gameId: props.gameId, name: playerName },
      });
      const playerId = res.data?.joinGameAsPlayer.player.id;
      if (!playerId) {
        throw new Error("Error getting playerId from server");
      }
      props.onSetPlayerId(playerId);
    },
    [joinGameAsPlayer, props.gameId, playerName]
  );
  return (
    <form onSubmit={handleJoinFormSubmit}>
      Your name:
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.currentTarget.value)}
      />
      <button type="submit">Join game</button>
    </form>
  );
}
