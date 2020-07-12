import React from "react";

import { PlayerName } from "./PlayerName";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  expectedActorPlayerNums: Set<number | null>;
  players: Array<PlayerFragment> | null;
  localPlayerNum: number | null;
};

export const PlayerDisplay = (props: PropsType) => {
  return (
    <div>
      {props.players?.map((player, playerNum) => (
        <PlayerName
          key={playerNum}
          player={player}
          isExpectedActor={props.expectedActorPlayerNums.has(playerNum)}
          isLocalPlayer={props.localPlayerNum === playerNum}
        />
      ))}
    </div>
  );
};
