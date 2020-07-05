/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionType } from "./globalTypes";

// ====================================================
// GraphQL fragment: expectedActionsFragment
// ====================================================

export interface expectedActionsFragment_actions {
  __typename: "ExpectedAction";
  type: ActionType | null;
  actorPlayerNum: number | null;
}

export interface expectedActionsFragment {
  __typename: "ExpectedActions";
  key: string;
  actions: expectedActionsFragment_actions[];
}
