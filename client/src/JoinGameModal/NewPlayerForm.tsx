import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import styled from "styled-components/macro";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { DividerLine, DividerOr } from "../components/Divider";
import { CenterColumnBox, Flexbox } from "../components/Flexbox";
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
    async e => {
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
        <HeaderPrompt as="div">Type a nickname</HeaderPrompt>
        <Flexbox>
          <NameInput
            value={playerName}
            onChange={e => setPlayerName(e.currentTarget.value)}
          />
          <PrimaryButton type="submit">Join game</PrimaryButton>
        </Flexbox>
      </div>
      <DividerLine>
        <DividerOr>Or</DividerOr>
      </DividerLine>
      <CenterColumnBox>
        <SecondaryButton onClick={props.onDismiss}>
          Spectate game
        </SecondaryButton>
      </CenterColumnBox>
    </form>
  );
}

const HeaderPrompt = styled(Header)`
  margin-bottom: ${p => p.theme.small};
`;

const NameInput = styled(Input)`
  flex-grow: 1;
  margin-right: ${p => p.theme.med};
  margin-bottom: ${p => p.theme.med};

  ${({ theme }) => theme.tablet} {
    margin-bottom: 0;
  }
`;
