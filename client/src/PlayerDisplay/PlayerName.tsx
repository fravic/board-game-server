import React from "react";
import styled from "styled-components/macro";

import { Flexbox } from "../components/Flexbox";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  isLocalPlayer: boolean;
  isExpectedActor: boolean;
  player: PlayerFragment;
};

export const PlayerName = (props: PropsType) => {
  const {
    player: { colorHex },
  } = props;
  return (
    <div>
      <Flexbox>
        <PlayerNameText style={{ color: colorHex }}>
          {props.player.name}
        </PlayerNameText>
        {props.isExpectedActor && (
          <IsExpectedActorMarker style={{ background: colorHex }} />
        )}
      </Flexbox>
      <PlayerStatus isLocalPlayer={props.isLocalPlayer} player={props.player} />
    </div>
  );
};

const PlayerNameText = styled.div`
  font-size: 34px;
  font-weight: bold;
`;

const IsExpectedActorMarker = styled.div`
  width: 20px;
  height: 20px;
`;

const PlayerStatus = (props: {
  isLocalPlayer: boolean;
  player: PlayerFragment;
}) => {
  if (props.isLocalPlayer) {
    return <>You</>;
  } else if (props.player.isConnected) {
    return <>Online</>;
  }
  return <>Offline</>;
};
