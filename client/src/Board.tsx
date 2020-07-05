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
  isCurrentPlayerTurn: boolean;
  gameId: string;
  players: Array<PlayerFragment>;
};

export function Board(props: Props) {
  const { board, currentPlayerNum, gameId, isCurrentPlayerTurn } = props;
  const [dropPiece] = useMutation<DropPiece, DropPieceVariables>(
    dropPieceMutationGql
  );
  const handleClickDropPiece = useCallback(
    async (columnIdx: number) => {
      if (currentPlayerNum === null) {
        return;
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
          clickable={isCurrentPlayerTurn}
          key={idx}
          onClickDropPiece={handleClickDropPiece}
          players={props.players}
        />
      ))}
    </div>
  );
}

type BoardColumnProps = {
  clickable: boolean;
  column: BoardColumnFragment;
  columnIdx: number;
  onClickDropPiece: (columnIdx: number) => Promise<any>;
  players: Array<PlayerFragment>;
};

function BoardColumn(props: BoardColumnProps) {
  const { clickable, column, columnIdx } = props;
  return (
    <div
      onClick={clickable ? () => props.onClickDropPiece(columnIdx) : undefined}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        boxShadow: clickable ? "0 0 3px rgba(0,255,0,0.5)" : "none",
      }}
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
