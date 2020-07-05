import gql from "graphql-tag";

export const boardFragmentGql = gql`
  fragment boardFragment on Board {
    id
    columns {
      pieces {
        playerId
      }
    }
    winningPlayerId
  }
`;
