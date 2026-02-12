import React, { type Dispatch, type SetStateAction } from "react";
import { Modal } from "./Modal";
import { GameModesToggle } from "../misc/GameModesToggle";
import type { DungeonState, PlayerState } from "../../utils/types";

interface GameModesModalProps {
  onClose: () => void;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
}

export const GameModesModal = ({
  onClose,
  playerState,
  setPlayerState,
  setDungeonState,
}: GameModesModalProps) => {
  return (
    <Modal title="Game Modes" isOpen onClose={onClose}>
      <GameModesToggle
        initialSelection={false}
        onModeSelect={onClose}
        playerState={playerState}
        setPlayerState={setPlayerState}
        setDungeonState={setDungeonState}
      />
    </Modal>
  );
};
