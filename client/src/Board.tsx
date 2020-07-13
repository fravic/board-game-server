import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useCallback } from "react";
import styled, { css, keyframes } from "styled-components/macro";

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
    <BoardContainer>
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
    </BoardContainer>
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
    <BoardColumnContainer
      onClick={clickable ? () => props.onClickDropPiece(columnIdx) : undefined}
    >
      {column.pieces.map((piece, idx) => (
        <div key={idx} css="padding: 3px">
          <BoardPieceContainer clickable={clickable}>
            {piece.playerNum !== null ? (
              <BoardPiece
                css={css`
                  animation: ${boardPieceDropAnimation} 0.3s
                    cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  background-color: ${props.players[piece.playerNum].colorHex};
                `}
              />
            ) : (
              <BoardPiece />
            )}
          </BoardPieceContainer>
        </div>
      ))}
    </BoardColumnContainer>
  );
}

const BoardContainer = styled.div`
  display: flex;
  flex-basis: 100%;
  padding: 5px;

  ${p => p.theme.tablet} {
    flex-basis: 60%;
    padding: ${p => p.theme.large};
  }
`;

const BoardColumnContainer = styled.div`
  width: calc(100% / 7);
  display: flex;
  flex-direction: column-reverse;
`;

const fadeInTop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scaleX(1.3);
  }
`;

const boardPieceContainerClickableHover = css`
  ${BoardColumnContainer}:hover &:after {
    content: "▼";
    font-size: 14px;
    color: ${p => p.theme.primaryCta};
    position: absolute;
    left: 50%;
    margin-left: -7px;
    top: 50%;
    margin-top: -7px;
    animation: ${fadeInTop} 0.2s ease-out;
    transform: scaleX(1.3);
    z-index: 1;
  }

  ${p => p.theme.tablet} {
    ${BoardColumnContainer}:hover &:after {
      font-size: 20px;
      margin-left: -10px;
      margin-top: -10px;
    }
  }
`;

const BoardPieceContainer = styled.div<{ clickable: boolean }>`
  position: relative;
  background: ${p => p.theme.inputBg};
  border-radius: 100%;

  ${p => (p.clickable ? boardPieceContainerClickableHover : "")}
`;

const BoardPiece = styled.div`
  position: relative;
  padding-top: 100%;
  width: 100%;
  border-radius: 100%;
  z-index: 2;
`;

const boardPieceDropAnimation = keyframes`
  0% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`;
