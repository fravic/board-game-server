/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetBoard
// ====================================================

export interface ResetBoard_resetBoard_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerNum: number | null;
}

export interface ResetBoard_resetBoard_columns {
  __typename: "BoardColumn";
  pieces: ResetBoard_resetBoard_columns_pieces[];
}

export interface ResetBoard_resetBoard {
  __typename: "Board";
  key: string;
  columns: ResetBoard_resetBoard_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerNum: number | null;
  lastPlayedColumn: number;
}

export interface ResetBoard {
  resetBoard: ResetBoard_resetBoard;
}

export interface ResetBoardVariables {
  gameId: string;
}
