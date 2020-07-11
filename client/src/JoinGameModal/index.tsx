import React from "react";

import { Modal } from "../components/Modal";
import { NewPlayerForm } from "./NewPlayerForm";
import { ReconnectAsPlayerForm } from "./ReconnectAsPlayerForm";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  acceptingNewPlayers: boolean;
  disconnectedPlayers: Array<PlayerFragment>;
  gameId: string;
  onSetPlayerNum: (playerNum: number) => void;
};

export function JoinGameModal(props: PropsType) {
  const [declinedToReconnect, setDeclinedToReconnect] = React.useState(false);
  if (props.disconnectedPlayers.length && !declinedToReconnect) {
    return (
      <Modal>
        <ReconnectAsPlayerForm
          disconnectedPlayers={props.disconnectedPlayers}
          onDeclineToReconnect={() => setDeclinedToReconnect(true)}
          onSetPlayerNum={props.onSetPlayerNum}
        />
      </Modal>
    );
  } else if (props.acceptingNewPlayers) {
    return (
      <Modal>
        <NewPlayerForm
          gameId={props.gameId}
          onSetPlayerNum={props.onSetPlayerNum}
        />
      </Modal>
    );
  }
  return null;
}
