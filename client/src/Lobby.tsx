import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useHistory } from "react-router-dom";

const createGameMutationGql = gql`
  mutation CreateGame($name: String!) {
    createGame(name: $name) {
      id
    }
  }
`;

type PropsType = {};

export function Lobby(props: PropsType) {
  const [gameName, setGameName] = React.useState("My New Game");
  const [createGame] = useMutation(createGameMutationGql);
  const history = useHistory();
  const onFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await createGame({ variables: { name: gameName } });
      history.push(`/game/${res.data?.createGame.id}`);
    },
    [createGame, gameName, history]
  );
  return (
    <form onSubmit={onFormSubmit}>
      <input
        onChange={(e) => setGameName(e.currentTarget.value)}
        value={gameName}
      />
      <input type="submit" />
    </form>
  );
}
