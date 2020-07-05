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
  mutation DropPiece($gameId: ID!, $playerNum: Int!, $column: Int!) {
    dropPiece(gameId: $gameId, playerNum: $playerNum, column: $column) {
      ...boardFragment
    }
  }
  ${boardFragmentGql}
`;

type Props = {
  board: BoardFragment;
  currentPlayerNum: number | null;
  gameId: string;
  players: Array<PlayerFragment>;
};

export function Board(props: Props) {
  const { board, currentPlayerNum, gameId } = props;
  const [dropPiece] = useMutation<DropPiece, DropPieceVariables>(
    dropPieceMutationGql
  );
  const handleClickDropPiece = useCallback(
    async (columnIdx: number) => {
      if (currentPlayerNum === null) {
        throw new Error("Cannot drop piece, no player");
      }
      await dropPiece({
        variables: {
          gameId,
          playerNum: currentPlayerNum,
          column: columnIdx,
        },
      });
    },
    [currentPlayerNum, dropPiece, gameId]
  );
  return (
    <div style={{ display: "flex" }}>
      {board.columns.map((col, idx) => (
        <BoardColumn
          column={col}
          columnIdx={idx}
          key={idx}
          onClickDropPiece={handleClickDropPiece}
          players={props.players}
        />
      ))}
    </div>
  );
}

type BoardColumnProps = {
  column: BoardColumnFragment;
  columnIdx: number;
  onClickDropPiece: (columnIdx: number) => Promise<any>;
  players: Array<PlayerFragment>;
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
            backgroundColor:
              piece.playerNum !== null
                ? props.players[piece.playerNum].colorHex
                : "#F2F3F4",
            width: 20,
            height: 20,
          }}
        />
      ))}
    </div>
  );
}
