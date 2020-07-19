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

// https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
export class Mutex {
  private mutex = Promise.resolve();

  lock(): PromiseLike<() => void> {
    let begin: (unlock: () => void) => void = unlock => {};

    this.mutex = this.mutex.then(() => {
      return new Promise(begin);
    });

    return new Promise(res => {
      begin = res;
    });
  }

  async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
    const unlock = await this.lock();
    try {
      return await Promise.resolve(fn());
    } finally {
      unlock();
    }
  }
}
