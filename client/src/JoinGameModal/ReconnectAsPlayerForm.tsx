import React from "react";
import styled from "styled-components";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import { Header } from "../components/Text";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";
import { Flexbox, GrowCenterBox } from "../components/Flexbox";

type PropsType = {
  acceptingNewPlayers: boolean;
  disconnectedPlayers: Array<PlayerFragment>;
  onDismiss: () => void;
  onClickNewPlayer: () => void;
  onSetPlayerNum: (playerNum: number) => void;
};

export function ReconnectAsPlayerForm(props: PropsType) {
  return (
    <>
      <ModalHeader>
        {props.acceptingNewPlayers
          ? "Reconnect as existing player, or join as new player?"
          : "Reconnect as existing player, or just spectate?"}
      </ModalHeader>
      <ModalFlexbox>
        <GrowCenterBoxColumn>
          {props.disconnectedPlayers.map((player) => (
            <ReconnectButton
              key={player.playerNum}
              onClick={() => {
                props.onSetPlayerNum(player.playerNum);
              }}
            >
              I am {player.name}
            </ReconnectButton>
          ))}
        </GrowCenterBoxColumn>
        <DividerLine />
        <GrowCenterBox>
          {props.acceptingNewPlayers ? (
            <PrimaryButton onClick={props.onClickNewPlayer}>
              Join as new player
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={props.onDismiss}>
              Spectate game
            </SecondaryButton>
          )}
        </GrowCenterBox>
      </ModalFlexbox>
    </>
  );
}

const ModalFlexbox = styled(Flexbox)`
  min-height: 180px;
`;

const ModalHeader = styled(Header)`
  display: block;
  margin-bottom: ${({ theme }) => theme.large};
  text-align: center;
`;

const DividerLine = styled.div`
  border-left: 1px solid ${({ theme }) => theme.lineBg};
`;

const GrowCenterBoxColumn = styled(GrowCenterBox)`
  flex-direction: column;
`;

const ReconnectButton = styled(SecondaryButton)`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.med};
  }
`;
