import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useHistory } from "react-router-dom";

import { CreateGame } from "./gql_types/CreateGame";
import { PrimaryButton } from "./components/Button";

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
  const onFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await createGame();
      history.push(`/game/${res.data?.createGame.roomCode}`);
    },
    [createGame, history]
  );
  return (
    <form onSubmit={onFormSubmit}>
      <PrimaryButton type="submit">Create a game</PrimaryButton>
    </form>
  );
}
