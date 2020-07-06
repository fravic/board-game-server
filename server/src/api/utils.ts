export type EpochSeconds = number;

export function currentEpochSeconds(): EpochSeconds {
  return Math.floor(new Date().getTime() / 1000);
}

const COLORS = ["#E96B43", "#55AEE9", "#A879E0"];

export function randomColorHex(except: string | null): string {
  let idx;
  do {
    idx = Math.floor(Math.random() * COLORS.length);
  } while (COLORS[idx] === except);
  return COLORS[idx];
}
