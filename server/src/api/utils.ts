import { Action } from "./action";
import { Node } from "./node";

export type EpochSeconds = number;

export type Reducer<ResultType> = (
  prev: ResultType,
  action: Action,
  // Mutable array of Nodes that have changed (after state updates have been applied) to send to the client
  clientUpdates: Array<Node>
) => ResultType;

export function currentEpochSeconds(): EpochSeconds {
  return Math.floor(new Date().getTime() / 1000);
}
