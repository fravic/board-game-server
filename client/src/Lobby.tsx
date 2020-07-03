import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";

const createGameMutationGql = gql`
  mutation CreateGame($name: String!) {
    createGame(name: $name, numPlayers: 2) {
      id
    }
  }
`;

type PropsType = {
  onSetGameId: (gameId: string) => void;
};

export function Lobby(props: PropsType) {
  const [gameName, setGameName] = React.useState("My New Game");
  const [createGame] = useMutation(createGameMutationGql);
  const onFormSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      const res = await createGame({ variables: { name: gameName } });
      props.onSetGameId(res.data?.createGame.id);
    },
    [createGame, props, gameName]
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
