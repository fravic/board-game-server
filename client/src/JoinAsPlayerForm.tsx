import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

import { Button } from "./components/Button";
import { Modal } from "./components/Modal";

import { playerFragment as PlayerFragment } from "./gql_types/playerFragment";
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

type PropsType = {
  acceptingNewPlayers: boolean;
  disconnectedPlayers: Array<PlayerFragment>;
  gameId: string;
  onSetPlayerNum: (playerNum: number) => void;
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
      const playerNum = res.data?.joinGameAsPlayer.player.playerNum;
      if (playerNum === undefined) {
        throw new Error("Error getting playerNum from server");
      }
      props.onSetPlayerNum(playerNum);
    },
    [joinGameAsPlayer, props]
  );
  return (
    <Modal>
      {props.acceptingNewPlayers && (
        <NewPlayerForm onSubmit={handleNewPlayerFormSubmit} />
      )}
      Or rejoin as:
      {props.disconnectedPlayers.map((player) => (
        <button
          key={player.playerNum}
          onClick={() => {
            props.onSetPlayerNum(player.playerNum);
          }}
        >
          {player.name}
        </button>
      ))}
    </Modal>
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
      <Button variant="primary" type="submit">
        Join game
      </Button>
    </form>
  );
}
