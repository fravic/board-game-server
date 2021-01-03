import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components/macro";

import { PrimaryButton } from "../components/Button";
import { Header } from "../components/Text";
import { PlayerName } from "./PlayerName";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  expectedActorPlayerNums: Set<number | null>;
  isExpectingAnotherPlayer: boolean;
  players: Array<PlayerFragment> | null;
  localPlayerNum: number | null;
  onResetBoardClick: () => any;
  roomCode: string | null;
  winningPlayerNum: number | null;
};

export const PlayerDisplay = (props: PropsType) => {
  const { localPlayerNum, roomCode } = props;
  const roomJoinLink = `${
    process.env.REACT_APP_URL_BASE ?? "localhost:3000"
  }/g/${roomCode || ""}`;
  const [linkCopied, setLinkCopied] = React.useState(false);
  const handleCopyLinkClick = React.useCallback(() => {
    if (roomJoinLink) {
      navigator.clipboard.writeText(roomJoinLink);
      setLinkCopied(true);
    }
  }, [roomJoinLink]);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const isRocketCrab = urlParams.get('rocketcrab') !== null;
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
      {localPlayerNum !== null && props.isExpectingAnotherPlayer && roomCode && !isRocketCrab && (
        <StatusText>
          Send a friend this page to play!
          <br />
          <div css="font-size: 14px;">Room code: {roomCode}</div>
          <CopyLinkButton onClick={handleCopyLinkClick}>
            {linkCopied ? "Link copied" : "Copy link"}
          </CopyLinkButton>
        </StatusText>
      )}
      {localPlayerNum === null && (
        <StatusText>
          You are spectating.
          <br />
          <Link
            to="/"
            css={css`
              color: ${p => p.theme.primaryCta};
            `}
          >
            Create your own game?
          </Link>
        </StatusText>
      )}
      {props.winningPlayerNum !== null && localPlayerNum !== null && (
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

const StatusText = styled(Header)`
  font-size: 18px;
`;

const CopyLinkButton = styled(PrimaryButton)`
  display: block;
  margin-top: ${p => p.theme.med};
  padding: 12px 20px;
  font-size: 18px;
`;
