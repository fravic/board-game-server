/**
 * GameObject allows for server responses to be optimized. Rather than returning
 * an entire Game, each response can include just the changed GameObjects.
 */
export interface GameObject {
  gameId: string;
  key: string;
  gqlName: string;
}
