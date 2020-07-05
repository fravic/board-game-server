/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: GameEvents
// ====================================================

export interface GameEvents_gameEvents_changedNodes_Player {
  __typename: "Player";
  id: string;
}

export interface GameEvents_gameEvents_changedNodes_Game_players {
  __typename: "Player";
  id: string;
  name: string;
}

export interface GameEvents_gameEvents_changedNodes_Game_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface GameEvents_gameEvents_changedNodes_Game {
  __typename: "Game";
  id: string;
  name: string;
  players: GameEvents_gameEvents_changedNodes_Game_players[];
  expectedActions: GameEvents_gameEvents_changedNodes_Game_expectedActions[];
}

export type GameEvents_gameEvents_changedNodes = GameEvents_gameEvents_changedNodes_Player | GameEvents_gameEvents_changedNodes_Game;

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
