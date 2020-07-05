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
}

export interface gameFragment_expectedActions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorId: string | null;
}

export interface gameFragment {
  __typename: "Game";
  id: string;
  name: string;
  players: gameFragment_players[];
  expectedActions: gameFragment_expectedActions[];
}
