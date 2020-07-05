import { produce } from "immer";
import { v4 as uuid } from "uuid";

import { Node } from "./node";
import { Action, DropPieceAction } from "./action";

export interface Board extends Node {
  gqlName: "Board";
  columns: Array<{ pieces: Array<{ playerId: string | null }> }>;
}

const COLUMNS = 7;
const ROWS = 6;

export function create(): Board {
  return {
    gqlName: "Board",
    id: uuid(),
    columns: Array(COLUMNS)
      .fill(null)
      .map((_) => ({
        pieces: Array(ROWS).fill({ playerId: null }),
      })),
  };
}

export const boardReducer = produce((draft: Board, action: Action) => {
  if (action.type === "DropPiece") {
    const dropPieceAction = action as DropPieceAction;
    const pieces = draft.columns[dropPieceAction.column].pieces;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].playerId === null) {
        pieces[i].playerId = dropPieceAction.playerId;
        break;
      }
    }
  }
});
