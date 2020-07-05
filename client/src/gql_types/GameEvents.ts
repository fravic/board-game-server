/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: GameEvents
// ====================================================

export interface GameEvents_gameEvents_changedNodes_Game_players {
  __typename: "Player";
  id: string;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface GameEvents_gameEvents_changedNodes_Game_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface GameEvents_gameEvents_changedNodes_Game_board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerId: string | null;
}

export interface GameEvents_gameEvents_changedNodes_Game_board_columns {
  __typename: "BoardColumn";
  pieces: GameEvents_gameEvents_changedNodes_Game_board_columns_pieces[];
}

export interface GameEvents_gameEvents_changedNodes_Game_board {
  __typename: "Board";
  id: string;
  columns: GameEvents_gameEvents_changedNodes_Game_board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerId: string | null;
}

export interface GameEvents_gameEvents_changedNodes_Game {
  __typename: "Game";
  id: string;
  name: string;
  players: GameEvents_gameEvents_changedNodes_Game_players[];
  expectedActions: GameEvents_gameEvents_changedNodes_Game_expectedActions[];
  board: GameEvents_gameEvents_changedNodes_Game_board;
}

export interface GameEvents_gameEvents_changedNodes_Player {
  __typename: "Player";
  id: string;
  name: string;
  isConnected: boolean;
  colorHex: string;
}

export interface GameEvents_gameEvents_changedNodes_Board_columns_pieces {
  __typename: "BoardPiece";
  /**
   * The player who owns this piece, or null if the piece is not owned
   */
  playerId: string | null;
}

export interface GameEvents_gameEvents_changedNodes_Board_columns {
  __typename: "BoardColumn";
  pieces: GameEvents_gameEvents_changedNodes_Board_columns_pieces[];
}

export interface GameEvents_gameEvents_changedNodes_Board {
  __typename: "Board";
  id: string;
  columns: GameEvents_gameEvents_changedNodes_Board_columns[];
  /**
   * If set, the id of the player who has won the game.
   */
  winningPlayerId: string | null;
}

export type GameEvents_gameEvents_changedNodes = GameEvents_gameEvents_changedNodes_Game | GameEvents_gameEvents_changedNodes_Player | GameEvents_gameEvents_changedNodes_Board;

export interface GameEvents_gameEvents {
  __typename: "GameEvent";
  changedNodes: GameEvents_gameEvents_changedNodes[];
}

export interface GameEvents {
  gameEvents: GameEvents_gameEvents;
}

export interface GameEventsVariables {
  gameId: string;
}
