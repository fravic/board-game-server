/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JoinGameAsPlayer
// ====================================================

export interface JoinGameAsPlayer_joinGameAsPlayer_player {
  __typename: "Player";
  id: string;
}

export interface JoinGameAsPlayer_joinGameAsPlayer {
  __typename: "GameAndPlayer";
  player: JoinGameAsPlayer_joinGameAsPlayer_player;
}

export interface JoinGameAsPlayer {
  /**
   * Creates a new player and adds the player to a game.
   */
  joinGameAsPlayer: JoinGameAsPlayer_joinGameAsPlayer;
}

export interface JoinGameAsPlayerVariables {
  gameId: string;
  name: string;
}
