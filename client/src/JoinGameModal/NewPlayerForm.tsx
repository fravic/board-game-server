import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import styled from "styled-components/macro";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { Input } from "../components/Form";
import { Header } from "../components/Text";

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
  onDismiss: () => void;
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
      <div>
        <Header as="div">Type a nickname</Header>
        <NameInput
          value={playerName}
          onChange={(e) => setPlayerName(e.currentTarget.value)}
        />
        <PrimaryButton type="submit">Join game</PrimaryButton>
      </div>
      <DividerLine />
      <SecondaryButton onClick={props.onDismiss}>Spectate game</SecondaryButton>
    </form>
  );
}

const NameInput = styled(Input)`
  margin-right: ${({ theme }) => theme.med};
`;

const DividerLine = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.lineBg};
  margin: ${({ theme }) => theme.xlarge} 0;
`;
