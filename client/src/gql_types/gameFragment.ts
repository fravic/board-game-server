/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL fragment: gameFragment
// ====================================================

export interface gameFragment_players {
  __typename: "Player";
  id: string;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface gameFragment_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface gameFragment_board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerId: string | null;
}

export interface gameFragment_board_columns {
  __typename: "BoardColumn";
  pieces: gameFragment_board_columns_pieces[];
}

export interface gameFragment_board {
  __typename: "Board";
  id: string;
  columns: gameFragment_board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerId: string | null;
}

export interface gameFragment {
  __typename: "Game";
  id: string;
  name: string;
  players: gameFragment_players[];
  expectedActions: gameFragment_expectedActions[];
  board: gameFragment_board;
}
