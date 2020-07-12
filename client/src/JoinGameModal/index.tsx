import React from "react";

import { Modal } from "../components/Modal";
import { NewPlayerForm } from "./NewPlayerForm";
import { ReconnectAsPlayerForm } from "./ReconnectAsPlayerForm";

import { playerFragment as PlayerFragment } from "../gql_types/playerFragment";

type PropsType = {
  acceptingNewPlayers: boolean;
  disconnectedPlayers: Array<PlayerFragment>;
  gameId: string;
  onDismiss: () => void;
  onSetPlayerNum: (playerNum: number) => void;
};

export function JoinGameModal(props: PropsType) {
  const [wantsToJoinAsNew, setWantsToJoinAsNew] = React.useState(false);
  if (props.disconnectedPlayers.length && !wantsToJoinAsNew) {
    return (
      <Modal>
        <ReconnectAsPlayerForm
          acceptingNewPlayers={props.acceptingNewPlayers}
          disconnectedPlayers={props.disconnectedPlayers}
          onDismiss={props.onDismiss}
          onClickNewPlayer={() => setWantsToJoinAsNew(true)}
          onSetPlayerNum={props.onSetPlayerNum}
        />
      </Modal>
    );
  } else if (props.acceptingNewPlayers) {
    return (
      <Modal>
        <NewPlayerForm
          gameId={props.gameId}
          onDismiss={props.onDismiss}
          onSetPlayerNum={props.onSetPlayerNum}
        />
      </Modal>
    );
  }
  return null;
}
