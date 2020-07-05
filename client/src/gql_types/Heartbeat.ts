/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Heartbeat
// ====================================================

export interface Heartbeat_heartbeat {
  __typename: "Game";
  gameId: string;
}

export interface Heartbeat {
  heartbeat: Heartbeat_heartbeat;
}

export interface HeartbeatVariables {
  gameId: string;
  playerNum?: number | null;
}
