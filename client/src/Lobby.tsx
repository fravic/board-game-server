import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useHistory } from "react-router-dom";

import { CreateGame, CreateGameVariables } from "./gql_types/CreateGame";
import { Button } from "./components/Button";

const createGameMutationGql = gql`
  mutation CreateGame {
    createGame {
      gameId
    }
  }
`;

type PropsType = {};

export function Lobby(props: PropsType) {
  const [createGame] = useMutation<CreateGame, CreateGameVariables>(
    createGameMutationGql
  );
  const history = useHistory();
  const onFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await createGame();
      history.push(`/game/${res.data?.createGame.gameId}`);
    },
    [createGame, history]
  );
  return (
    <form onSubmit={onFormSubmit}>
      <Button variant="primary" type="submit">
        Create a game
      </Button>
    </form>
  );
}
