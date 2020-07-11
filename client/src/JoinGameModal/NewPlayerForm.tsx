import { useMutation } from "@apollo/react-hooks";
import React from "react";
import gql from "graphql-tag";

import { PrimaryButton } from "../components/Button";

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
  gameId: string;
  onSetPlayerNum: (playerNum: number) => void;
};

export function NewPlayerForm(props: PropsType) {
  const [playerName, setPlayerName] = React.useState("");
  const [joinGameAsPlayer] = useMutation<
    JoinGameAsPlayer,
    JoinGameAsPlayerVariables
  >(joinGameAsPlayerMutationGql);
  const handleFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await joinGameAsPlayer({
        variables: { gameId: props.gameId, name: playerName },
      });
      const playerNum = res.data?.joinGameAsPlayer.player.playerNum;
      if (playerNum === undefined) {
        throw new Error("Error getting playerNum from server");
      }
      props.onSetPlayerNum(playerNum);
    },
    [joinGameAsPlayer, playerName, props]
  );
  return (
    <form onSubmit={handleFormSubmit}>
      Your name:
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.currentTarget.value)}
      />
      <PrimaryButton type="submit">Join game</PrimaryButton>
    </form>
  );
}
