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
  key: string;
  playerNum: number;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface gameFragment_expectedActions_actions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorPlayerNum: number | null;
}

export interface gameFragment_expectedActions {
  __typename: "ExpectedActions";
  key: string;
  actions: gameFragment_expectedActions_actions[];
}

export interface gameFragment_board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerNum: number | null;
}

export interface gameFragment_board_columns {
  __typename: "BoardColumn";
  pieces: gameFragment_board_columns_pieces[];
}

export interface gameFragment_board {
  __typename: "Board";
  key: string;
  columns: gameFragment_board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerNum: number | null;
}

export interface gameFragment {
  __typename: "Game";
  gameId: string;
  name: string;
  key: string;
  players: gameFragment_players[];
  expectedActions: gameFragment_expectedActions;
  board: gameFragment_board;
}
