import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useCallback } from "react";

import { playerFragment as PlayerFragment } from "./gql_types/playerFragment";
import { boardFragmentGql } from "./fragments";

import { DropPiece, DropPieceVariables } from "./gql_types/DropPiece";
import {
  Game_game_board as BoardFragment,
  Game_game_board_columns as BoardColumnFragment,
} from "./gql_types/Game";

export const dropPieceMutationGql = gql`
  mutation DropPiece($gameId: ID!, $playerId: ID!, $column: Int!) {
    dropPiece(gameId: $gameId, playerId: $playerId, column: $column) {
      ...boardFragment
    }
  }
  ${boardFragmentGql}
`;

type Props = {
  board: BoardFragment;
  currentPlayerId: string | null;
  gameId: string;
  players: Array<PlayerFragment>;
};

export function Board(props: Props) {
  const { board, currentPlayerId, gameId } = props;
  const [dropPiece] = useMutation<DropPiece, DropPieceVariables>(
    dropPieceMutationGql
  );
  const handleClickDropPiece = useCallback(
    async (columnIdx: number) => {
      if (!currentPlayerId) {
        throw new Error("Cannot drop piece, no player");
      }
      await dropPiece({
        variables: {
          gameId,
          playerId: currentPlayerId,
          column: columnIdx,
        },
      });
    },
    [currentPlayerId, dropPiece, gameId]
  );
  const playersById = indexPlayersById(props.players);
  return (
    <div style={{ display: "flex" }}>
      {board.columns.map((col, idx) => (
        <BoardColumn
          column={col}
          columnIdx={idx}
          key={idx}
          onClickDropPiece={handleClickDropPiece}
          playersById={playersById}
        />
      ))}
    </div>
  );
}

type BoardColumnProps = {
  column: BoardColumnFragment;
  columnIdx: number;
  onClickDropPiece: (columnIdx: number) => void;
  playersById: { [id: string]: PlayerFragment };
};

function BoardColumn(props: BoardColumnProps) {
  const { column, columnIdx } = props;
  return (
    <div
      onClick={() => props.onClickDropPiece(columnIdx)}
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {column.pieces.map((piece, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: piece.playerId
              ? props.playersById[piece.playerId].colorHex
              : "transparent",
            width: 20,
            height: 20,
          }}
        />
      ))}
    </div>
  );
}

function indexPlayersById(players: Array<PlayerFragment>) {
  return players.reduce((soFar, next) => ({ ...soFar, [next.id]: next }), {});
}
