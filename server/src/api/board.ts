import { produce } from "immer";
import { v4 as uuid } from "uuid";

import { Node } from "./node";
import { Action, DropPieceAction } from "./action";

export interface Board extends Node {
  gqlName: "Board";
  columns: Array<{ pieces: Array<{ playerId: string | null }> }>;
  winningPlayerId: string | null;
}

const COLUMNS = 7;
const ROWS = 6;

export function create(): Board {
  return {
    gqlName: "Board",
    id: uuid(),
    winningPlayerId: null,
    columns: Array(COLUMNS)
      .fill(null)
      .map((_) => ({
        pieces: Array(ROWS).fill({ playerId: null }),
      })),
  };
}

export const boardReducer = produce((draft: Board, action: Action) => {
  if (action.type === "DropPiece") {
    const { column, playerId } = action as DropPieceAction;
    const pieces = draft.columns[column].pieces;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].playerId === null) {
        pieces[i].playerId = playerId;
        if (_didNewPieceCauseWinner(draft, column, i)) {
          draft.winningPlayerId = playerId;
        }
        break;
      }
    }
  }
});

const NUM_PIECES_FOR_WIN = 4;

function _didNewPieceCauseWinner(board: Board, x: number, y: number): boolean {
  const playerId = board.columns[x].pieces[y].playerId;
  if (!playerId) {
    throw new Error(`No player at column ${x}, row ${y}`);
  }
  const leftCount = _numPiecesInARow(board, playerId, x - 1, y, -1, 0);
  const rightCount = _numPiecesInARow(board, playerId, x + 1, y, 1, 0);
  if (leftCount + rightCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const upCount = _numPiecesInARow(board, playerId, x, y - 1, 0, -1);
  const downCount = _numPiecesInARow(board, playerId, x, y + 1, 0, 1);
  if (upCount + downCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const diagNNCount = _numPiecesInARow(board, playerId, x - 1, y - 1, -1, -1);
  const diagPPCount = _numPiecesInARow(board, playerId, x + 1, y + 1, 1, 1);
  if (diagNNCount + diagPPCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  const diagNPCount = _numPiecesInARow(board, playerId, x - 1, y + 1, -1, 1);
  const diagPNCount = _numPiecesInARow(board, playerId, x + 1, y - 1, 1, -1);
  if (diagNPCount + diagPNCount + 1 >= NUM_PIECES_FOR_WIN) {
    return true;
  }
  return false;
}

function _numPiecesInARow(
  board: Board,
  playerId: string,
  x: number,
  y: number,
  dx: number,
  dy: number
): number {
  let count = 0;
  while (x >= 0 && x < COLUMNS && y >= 0 && y < ROWS) {
    if (board.columns[x].pieces[y].playerId !== playerId) {
      return count;
    }
    count++;
    x += dx;
    y += dy;
  }
  return count;
}
