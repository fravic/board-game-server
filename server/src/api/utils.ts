export type EpochSeconds = number;

export function currentEpochSeconds(): EpochSeconds {
  return Math.floor(new Date().getTime() / 1000);
}

const COLORS = ["#FFA600", "#85C1E9", "#ABEBC6", "#C39BD3"];

export function randomColorHex(except: string | null): string {
  let idx;
  do {
    idx = Math.floor(Math.random() * COLORS.length);
  } while (COLORS[idx] === except);
  return COLORS[idx];
}
