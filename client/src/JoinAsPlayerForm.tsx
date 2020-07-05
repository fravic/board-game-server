import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

import { playerFragment as PlayerFragment } from "./gql_types/playerFragment";
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
  acceptingNewPlayers: boolean;
  disconnectedPlayers: Array<PlayerFragment>;
  gameId: string;
  onSetPlayerId: (playerId: string) => void;
};

export function JoinAsPlayerForm(props: PropsType) {
  const [joinGameAsPlayer] = useMutation<
    JoinGameAsPlayer,
    JoinGameAsPlayerVariables
  >(joinGameAsPlayerMutationGql);
  const handleNewPlayerFormSubmit = React.useCallback(
    async (name) => {
      const res = await joinGameAsPlayer({
        variables: { gameId: props.gameId, name },
      });
      const playerId = res.data?.joinGameAsPlayer.player.id;
      if (!playerId) {
        throw new Error("Error getting playerId from server");
      }
      props.onSetPlayerId(playerId);
    },
    [joinGameAsPlayer, props]
  );
  return (
    <>
      {props.acceptingNewPlayers && (
        <NewPlayerForm onSubmit={handleNewPlayerFormSubmit} />
      )}
      Or rejoin as:
      {props.disconnectedPlayers.map((player) => (
        <button
          key={player.id}
          onClick={() => {
            props.onSetPlayerId(player.id);
          }}
        >
          {player.name}
        </button>
      ))}
    </>
  );
}

type NewPlayerFormPropsType = {
  onSubmit: (name: string) => Promise<any>;
};

function NewPlayerForm(props: NewPlayerFormPropsType) {
  const [playerName, setPlayerName] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(playerName);
      }}
    >
      Your name:
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.currentTarget.value)}
      />
      <button type="submit">Join game</button>
    </form>
  );
}
