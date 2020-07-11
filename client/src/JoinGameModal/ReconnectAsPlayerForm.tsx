import React from "react";

import { SecondaryButton } from "../components/Button";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  disconnectedPlayers: Array<PlayerFragment>;
  onDeclineToReconnect: () => void;
  onSetPlayerNum: (playerNum: number) => void;
};

export function ReconnectAsPlayerForm(props: PropsType) {
  return (
    <>
      {props.disconnectedPlayers.map((player) => (
        <SecondaryButton
          key={player.playerNum}
          onClick={() => {
            props.onSetPlayerNum(player.playerNum);
          }}
        >
          {player.name}
        </SecondaryButton>
      ))}
    </>
  );
}
