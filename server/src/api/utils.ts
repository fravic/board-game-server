export type EpochSeconds = number;

export function currentEpochSeconds(): EpochSeconds {
  return Math.floor(new Date().getTime() / 1000);
}

const COLORS = ["#F8CA9D", "#8EC9BB", "#8AC0DE", "#FB8E7E"];

export function randomColorHex(except: string | null): string {
  let idx;
  do {
    idx = Math.floor(Math.random() * COLORS.length);
  } while (COLORS[idx] === except);
  return COLORS[idx];
}
