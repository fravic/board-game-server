import React from "react";
import styled, { keyframes } from "styled-components/macro";

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
    <PlayerNameContainer>
      <Flexbox>
        <PlayerNameText style={{ color: colorHex }}>
          {props.player.name}
        </PlayerNameText>
        {props.isExpectedActor && (
          <ExpectedActorArrowContainer>
            <ExpectedActorArrow colorHex={colorHex} />
          </ExpectedActorArrowContainer>
        )}
      </Flexbox>
      <PlayerStatus isLocalPlayer={props.isLocalPlayer} player={props.player} />
    </PlayerNameContainer>
  );
};

const PlayerNameContainer = styled.div`
  margin-bottom: ${p => p.theme.large};
`;

const PlayerNameText = styled.div`
  font-size: 34px;
  font-weight: bold;
  line-height: 36px;
`;

const PlayerStatus = (props: {
  isLocalPlayer: boolean;
  player: PlayerFragment;
}) => {
  const { player, isLocalPlayer } = props;
  let connectionIndicator = null;
  if (player.isConnected) {
    connectionIndicator = <ConnectionIndicatorConnected />;
  } else {
    connectionIndicator = <ConnectionIndicatorDisconnected />;
  }
  if (isLocalPlayer) {
    return <>{connectionIndicator}You</>;
  } else if (player.isConnected) {
    return <>{connectionIndicator}Online</>;
  }
  return <>{connectionIndicator}Offline</>;
};

const ConnectionIndicator = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-right: ${p => p.theme.small};
`;

const ConnectionIndicatorConnected = styled(ConnectionIndicator)`
  background: ${p => p.theme.okayBg};
`;

const ConnectionIndicatorDisconnected = styled(ConnectionIndicator)`
  background: ${p => p.theme.alertLightBg};
`;

const fadeInAnim = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
`;

const ExpectedActorArrowContainer = styled.div`
  margin-left: ${p => p.theme.small};
  margin-top: 8px;

  animation: ${fadeInAnim} 0.2s ease-out;
`;

const ExpectedActorArrow = (props: { colorHex: string }) => (
  <svg
    fill="none"
    height="21"
    viewBox="0 0 15 21"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m.00000023 10.4792 14.99999977-10.000013v20.000013z"
      fill={props.colorHex}
    />
  </svg>
);
