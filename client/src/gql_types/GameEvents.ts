/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: GameEvents
// ====================================================

export interface GameEvents_gameEvents_changed_Game_players {
  __typename: "Player";
  gameId: string;
  key: string;
  playerNum: number;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface GameEvents_gameEvents_changed_Game_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface GameEvents_gameEvents_changed_Game_board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerNum: number | null;
}

export interface GameEvents_gameEvents_changed_Game_board_columns {
  __typename: "BoardColumn";
  pieces: GameEvents_gameEvents_changed_Game_board_columns_pieces[];
}

export interface GameEvents_gameEvents_changed_Game_board {
  __typename: "Board";
  gameId: string;
  key: string;
  columns: GameEvents_gameEvents_changed_Game_board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerNum: number | null;
}

export interface GameEvents_gameEvents_changed_Game {
  __typename: "Game";
  gameId: string;
  key: string;
  name: string;
  players: GameEvents_gameEvents_changed_Game_players[];
  expectedActions: GameEvents_gameEvents_changed_Game_expectedActions[];
  board: GameEvents_gameEvents_changed_Game_board;
}

export interface GameEvents_gameEvents_changed_Player {
  __typename: "Player";
  gameId: string;
  key: string;
  playerNum: number;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface GameEvents_gameEvents_changed_Board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerNum: number | null;
}

export interface GameEvents_gameEvents_changed_Board_columns {
  __typename: "BoardColumn";
  pieces: GameEvents_gameEvents_changed_Board_columns_pieces[];
}

export interface GameEvents_gameEvents_changed_Board {
  __typename: "Board";
  gameId: string;
  key: string;
  columns: GameEvents_gameEvents_changed_Board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerNum: number | null;
}

export type GameEvents_gameEvents_changed = GameEvents_gameEvents_changed_Game | GameEvents_gameEvents_changed_Player | GameEvents_gameEvents_changed_Board;

export interface GameEvents_gameEvents {
  __typename: "GameEvent";
  changed: GameEvents_gameEvents_changed[];
}

export interface GameEvents {
  gameEvents: GameEvents_gameEvents;
}

export interface GameEventsVariables {
  gameId: string;
}
