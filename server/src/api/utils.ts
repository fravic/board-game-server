export type EpochSeconds = number;

export function currentEpochSeconds(): EpochSeconds {
  return Math.floor(new Date().getTime() / 1000);
}
