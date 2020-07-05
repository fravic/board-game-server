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
  id: string;
  name: string;
}

export interface Game_game_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface Game_game {
  __typename: "Game";
  id: string;
  name: string;
  players: Game_game_players[];
  expectedActions: Game_game_expectedActions[];
}

export interface Game {
  game: Game_game;
}

export interface GameVariables {
  id: string;
}
