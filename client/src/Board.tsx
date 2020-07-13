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
          isLastPlayed={board.lastPlayedColumn === idx}
        />
      ))}
    </BoardContainer>
  );
}

type BoardColumnProps = {
  clickable: boolean;
  column: BoardColumnFragment;
  columnIdx: number;
  isLastPlayed: boolean;
  onClickDropPiece: (columnIdx: number) => Promise<any>;
  players: Array<PlayerFragment>;
};

function BoardColumn(props: BoardColumnProps) {
  const { clickable, column, columnIdx } = props;
  const firstEmptyPieceIdx = column.pieces.findIndex(p => p.playerNum === null);
  const topFilledPieceIdx =
    firstEmptyPieceIdx === -1
      ? column.pieces.length - 1
      : firstEmptyPieceIdx - 1;
  const columnFull = firstEmptyPieceIdx === -1;
  return (
    <BoardColumnContainer
      onClick={
        clickable && !columnFull
          ? () => props.onClickDropPiece(columnIdx)
          : undefined
      }
    >
      {column.pieces.map((piece, idx) => (
        <BoardPieceSpacer key={idx}>
          <BoardPieceContainer clickable={clickable && !columnFull}>
            {piece.playerNum !== null ? (
              <BoardPiece
                css={css`
                  animation: ${boardPieceDropAnimation} 0.3s
                    cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  background-color: ${props.players[piece.playerNum].colorHex};
                `}
              >
                {props.isLastPlayed && idx === topFilledPieceIdx && (
                  <LastPlayedIcon />
                )}
              </BoardPiece>
            ) : (
              <BoardPiece />
            )}
          </BoardPieceContainer>
        </BoardPieceSpacer>
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

const BoardPieceSpacer = styled.div`
  padding: 3px;

  ${p => p.theme.desktop} {
    padding: 8px;
  }
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

const boardGamePieceDropIndicator = css`
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
`;

const boardPieceContainerClickableHover = css`
  ${BoardColumnContainer}:active &:after {
    ${boardGamePieceDropIndicator}
  }
  @media (hover: hover) {
    ${BoardColumnContainer}:hover &:after {
      ${boardGamePieceDropIndicator}
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

const LastPlayedIcon = () => (
  <div
    css={css`
      position: absolute;
      top: 25%;
      left: 25%;
      width: 50%;
      height: 50%;
    `}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="#fff"
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"
      />
    </svg>
  </div>
);
