import React from "react";
import styled from "styled-components/macro";

import { PrimaryButton } from "../components/Button";
import { PlayerName } from "./PlayerName";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  expectedActorPlayerNums: Set<number | null>;
  players: Array<PlayerFragment> | null;
  localPlayerNum: number | null;
  onResetBoardClick: () => any;
  winningPlayerNum: number | null;
};

export const PlayerDisplay = (props: PropsType) => {
  return (
    <PlayerDisplayWrapper>
      {props.players?.map((player, playerNum) => (
        <PlayerName
          key={playerNum}
          player={player}
          isExpectedActor={props.expectedActorPlayerNums.has(playerNum)}
          isLocalPlayer={props.localPlayerNum === playerNum}
          isWinner={props.winningPlayerNum === playerNum}
        />
      ))}
      {props.winningPlayerNum !== null && (
        <PrimaryButton onClick={props.onResetBoardClick}>
          Play again
        </PrimaryButton>
      )}
    </PlayerDisplayWrapper>
  );
};

const PlayerDisplayWrapper = styled.div`
  padding: ${p => p.theme.large};
  flex: 100% 0 0;

  ${p => p.theme.tablet} {
    flex: 1 0 0;
  }
`;
