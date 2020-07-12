import randString from "randomstring";

import * as gameApi from "./game";
import { Redis } from "../redis";
import { EpochSeconds, currentEpochSeconds } from "./utils";

export type RoomCode = {
  gameId: string;
  code: string;
};

const ROOM_CODE_REDIS_PREFIX = "room_code_";
const ROOM_CODE_LEN = 4;
const ROOM_CODE_EXPIRY: EpochSeconds = 60 * 60 * 24 * 10; // 10 days
const MAX_CREATION_ATTEMPTS = 5;

export async function create(
  fields: Pick<RoomCode, "gameId">,
  redis: Redis
): Promise<RoomCode> {
  let game: gameApi.Game | null = null;
  let code;
  let attempts = 0;
  do {
    if (++attempts > MAX_CREATION_ATTEMPTS) {
      throw new Error("Unable to generate room code");
    }
    code = randString.generate({
      length: ROOM_CODE_LEN,
      readable: true,
      capitalization: "uppercase",
    });
    // If a recent game with this room code already exists, generate another one
    try {
      const roomCode = await fetch(code, redis);
      game = await gameApi.fetch(roomCode.gameId, redis);
    } catch (e) {
      if (
        e instanceof RoomCodeNotFoundError ||
        e instanceof RoomCodeExpiredError ||
        e instanceof gameApi.GameNotFoundError
      ) {
        // We good with this code
        return {
          gameId: fields.gameId,
          code,
        };
      }
      // Some other error occurred, re-raise it
      throw e;
    }
  } while (game !== null && !_isRoomCodeExpired(game));
  throw new Error("Unable to generate room code");
}

export class RoomCodeNotFoundError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, RoomCodeNotFoundError.prototype);
  }
}
export class RoomCodeExpiredError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, RoomCodeExpiredError.prototype);
  }
}

export async function fetch(code: string, redis: Redis): Promise<RoomCode> {
  const uppercaseCode = code.toUpperCase();
  const unparsed = await redis.get(_roomCodeStorageKey(uppercaseCode));
  if (!unparsed) {
    throw new RoomCodeNotFoundError(
      `Could not find room with code ${uppercaseCode}`
    );
  }
  const parsed: RoomCode = JSON.parse(unparsed);
  const game = await gameApi.fetch(parsed.gameId, redis);
  if (_isRoomCodeExpired(game)) {
    throw new RoomCodeExpiredError("Sorry, this room code has expired.");
  }
  return parsed;
}

export async function save(
  roomCode: RoomCode,
  redis: Redis
): Promise<RoomCode> {
  await redis.set(_roomCodeStorageKey(roomCode.code), JSON.stringify(roomCode));
  return roomCode;
}

function _roomCodeStorageKey(code: string): string {
  return `${ROOM_CODE_REDIS_PREFIX}${code}`;
}

function _isRoomCodeExpired(game: gameApi.Game): boolean {
  const now = currentEpochSeconds();
  return now - game.lastUpdated > ROOM_CODE_EXPIRY;
}
