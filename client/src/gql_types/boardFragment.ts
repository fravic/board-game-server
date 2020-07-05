/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: boardFragment
// ====================================================

export interface boardFragment_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerId: string | null;
}

export interface boardFragment_columns {
  __typename: "BoardColumn";
  pieces: boardFragment_columns_pieces[];
}

export interface boardFragment {
  __typename: "Board";
  id: string;
  columns: boardFragment_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerId: string | null;
}
