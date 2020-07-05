/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DropPiece
// ====================================================

export interface DropPiece_dropPiece_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerId: string | null;
}

export interface DropPiece_dropPiece_columns {
  __typename: "BoardColumn";
  pieces: DropPiece_dropPiece_columns_pieces[];
}

export interface DropPiece_dropPiece {
  __typename: "Board";
  id: string;
  columns: DropPiece_dropPiece_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerId: string | null;
}

export interface DropPiece {
  dropPiece: DropPiece_dropPiece;
}

export interface DropPieceVariables {
  gameId: string;
  playerId: string;
  column: number;
}
