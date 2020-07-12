/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateGame
// ====================================================

export interface CreateGame_createGame_game {
  __typename: "Game";
  gameId: string;
}

export interface CreateGame_createGame {
  __typename: "CreateGamePayload";
  game: CreateGame_createGame_game;
  roomCode: string;
}

export interface CreateGame {
  createGame: CreateGame_createGame;
}
