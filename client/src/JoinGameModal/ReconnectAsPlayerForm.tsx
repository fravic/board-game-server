import React from "react";
import styled from "styled-components/macro";

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
      <Flexbox>
        <GrowCenterBoxColumn>
          {props.disconnectedPlayers.map(player => (
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
      </Flexbox>
    </>
  );
}

const ModalHeader = styled(Header)`
  display: block;
  margin-bottom: ${({ theme }) => theme.large};
  text-align: center;
`;

const DividerLine = styled.div`
  border-left: 1px solid ${({ theme }) => theme.lineBg};
  display: none;

  ${p => p.theme.tablet} {
    display: block;
  }
`;

const GrowCenterBoxColumn = styled(GrowCenterBox)`
  flex-direction: column;
  flex: 100% 0 0;
  ${p => p.theme.tablet} {
    flex: 50% 0 0;
  }
`;

const ReconnectButton = styled(SecondaryButton)`
  margin-bottom: ${({ theme }) => theme.med};

  ${p => p.theme.tablet} {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
