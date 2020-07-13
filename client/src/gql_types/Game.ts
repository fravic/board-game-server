/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Game
// ====================================================

export interface Game_game_players {
  __typename: "Player";
  key: string;
  playerNum: number;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface Game_game_expectedActions_actions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorPlayerNum: number | null;
}

export interface Game_game_expectedActions {
  __typename: "ExpectedActions";
  key: string;
  actions: Game_game_expectedActions_actions[];
}

export interface Game_game_board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerNum: number | null;
}

export interface Game_game_board_columns {
  __typename: "BoardColumn";
  pieces: Game_game_board_columns_pieces[];
}

export interface Game_game_board {
  __typename: "Board";
  key: string;
  columns: Game_game_board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerNum: number | null;
  lastPlayedColumn: number;
}

export interface Game_game {
  __typename: "Game";
  gameId: string;
  name: string;
  key: string;
  players: Game_game_players[];
  expectedActions: Game_game_expectedActions;
  board: Game_game_board;
}

export interface Game {
  game: Game_game;
}

export interface GameVariables {
  id: string;
}
