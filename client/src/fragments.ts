import gql from "graphql-tag";

export const boardFragmentGql = gql`
  fragment boardFragment on Board {
    key
    columns {
      pieces {
        playerNum
      }
    }
    winningPlayerNum
  }
`;
