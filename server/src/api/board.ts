import { produce } from "immer";

import { GameObject } from "./game_object";
import { Action, DropPieceAction } from "./action";

export interface Board extends GameObject {
  gqlName: "Board";
  columns: Array<{ pieces: Array<{ playerNum: number | null }> }>;
  winningPlayerNum: number | null;
}

const COLUMNS = 7;
const ROWS = 6;

const DEFAULT_COLUMNS = Array(COLUMNS)
  .fill(null)
  .map((_) => ({
    pieces: Array(ROWS).fill({ playerNum: null }),
  }));

export function create(gameId: string): Board {
  return {
    gqlName: "Board",
    gameId,
    key: "board",
    winningPlayerNum: null,
    columns: DEFAULT_COLUMNS,
  };
}

export const boardReducer = produce((draft: Board, action: Action) => {
  if (action.type === "DropPiece") {
    const { column, playerNum } = action as DropPieceAction;
    const pieces = draft.columns[column].pieces;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].playerNum === null) {
        pieces[i].playerNum = playerNum;
        if (_didNewPieceCauseWinner(draft, column, i)) {
          draft.winningPlayerNum = playerNum;
        }
        break;
      }
    }
  } else if (action.type === "ResetBoard") {
    draft.columns = DEFAULT_COLUMNS;
    draft.winningPlayerNum = null;
  }
});

const NUM_PIECES_FOR_WIN = 4;

function _didNewPieceCauseWinner(board: Board, x: number, y: number): boolean {
  const playerNum = board.columns[x].pieces[y].playerNum;
  if (playerNum === null) {
    throw new Error(`No player at column ${x}, row ${y}`);
  }
  const leftCount = _numPiecesInARow(board, playerNum, x - 1, y, -1, 0);
  const rightCount = _numPiecesInARow(board, playerNum, x + 1, y, 1, 0);
  if (leftCount + rightCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const upCount = _numPiecesInARow(board, playerNum, x, y - 1, 0, -1);
  const downCount = _numPiecesInARow(board, playerNum, x, y + 1, 0, 1);
  if (upCount + downCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const diagNNCount = _numPiecesInARow(board, playerNum, x - 1, y - 1, -1, -1);
  const diagPPCount = _numPiecesInARow(board, playerNum, x + 1, y + 1, 1, 1);
  if (diagNNCount + diagPPCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const diagNPCount = _numPiecesInARow(board, playerNum, x - 1, y + 1, -1, 1);
  const diagPNCount = _numPiecesInARow(board, playerNum, x + 1, y - 1, 1, -1);
  if (diagNPCount + diagPNCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  return false;
}

function _numPiecesInARow(
  board: Board,
  playerNum: number,
  x: number,
  y: number,
  dx: number,
  dy: number
): number {
  let count = 0;
  while (x >= 0 && x < COLUMNS && y >= 0 && y < ROWS) {
    if (board.columns[x].pieces[y].playerNum !== playerNum) {
      return count;
    }
    count++;
    x += dx;
    y += dy;
  }
  return count;
}
