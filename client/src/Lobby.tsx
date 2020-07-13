import { useMutation } from "@apollo/react-hooks";
import GithubCorner from "react-github-corner";
import gql from "graphql-tag";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";

import { PrimaryButton, SecondaryButton } from "./components/Button";
import { DividerLine, DividerOr } from "./components/Divider";
import { Input } from "./components/Form";
import { Headline, Header } from "./components/Text";
import { DARK_GRAY } from "./components/theme";

import { CreateGame } from "./gql_types/CreateGame";

const createGameMutationGql = gql`
  mutation CreateGame {
    createGame {
      game {
        gameId
      }
      roomCode
    }
  }
`;

type PropsType = {};

export function Lobby(props: PropsType) {
  const [createGame] = useMutation<CreateGame>(createGameMutationGql);
  const history = useHistory();
  const onClickCreateGame = React.useCallback(async () => {
    const res = await createGame();
    history.push(`/game/${res.data?.createGame.roomCode}`);
  }, [createGame, history]);
  const [roomCode, setRoomCode] = React.useState("");
  const onSubmitJoinGame = React.useCallback(
    async e => {
      e.preventDefault();
      history.push(`/game/${roomCode}`);
    },
    [history, roomCode]
  );
  return (
    <LobbyContainer>
      <LobbyHeadline as="div">four in a row</LobbyHeadline>
      <PrimaryButton onClick={onClickCreateGame}>
        Create a game&nbsp;&nbsp;:)
      </PrimaryButton>
      <DividerLine>
        <DividerOr>Or</DividerOr>
      </DividerLine>
      <form onSubmit={onSubmitJoinGame}>
        <RoomCodeHeader>Enter a room code</RoomCodeHeader>
        <RoomCodeInput
          placeholder="eg. ABCD"
          onChange={e => setRoomCode(e.target.value)}
          maxLength={4}
        />
        <SecondaryButton type="submit">Join game</SecondaryButton>
      </form>
      <GithubCorner
        href="https://github.com/fravic/board-game-server"
        bannerColor={DARK_GRAY}
      />
    </LobbyContainer>
  );
}

const LobbyContainer = styled.div`
  padding: ${p => p.theme.gutterSmall};
  max-width: 720px;
  margin: 0 auto;

  ${p => p.theme.tablet} {
    padding: ${p => p.theme.gutterLarge};
    text-align: center;
  }
`;

const LobbyHeadline = styled(Headline)`
  margin-top: ${p => p.theme.xlarge};
  margin-bottom: ${p => p.theme.large};
  text-align: center;
`;

const RoomCodeHeader = styled(Header)`
  display: block;
  margin-bottom: ${p => p.theme.small};
`;

const RoomCodeInput = styled(Input)`
  margin-bottom: ${p => p.theme.med};
  ${p => p.theme.tablet} {
    margin-right: ${p => p.theme.small};
  }
`;
