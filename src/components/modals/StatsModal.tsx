import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "./Modal";
import { defaultPlayerState, type PlayerState } from "../../utils/types";
import clsx from "clsx";
import "./StatsModal.scss";
import { Stats } from "../misc/Stats";

interface StatsModalProps {
  onClose: () => void;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

const resetPressRequired = 4;

export const StatsModal = ({
  onClose,
  playerState,
  setPlayerState,
}: StatsModalProps) => {
  const [resetPressesLeft, setResetPressesLeft] = useState(resetPressRequired);

  return (
    <Modal title="Stats" isOpen onClose={onClose}>
      <Stats playerState={playerState} />

      <button
        className={clsx(
          "plain-btn",
          resetPressesLeft < resetPressRequired && "red-btn",
        )}
        onClick={() => {
          if (resetPressesLeft > 1) {
            setResetPressesLeft(resetPressesLeft - 1);
          } else {
            setResetPressesLeft(resetPressRequired);
            setPlayerState(defaultPlayerState);
          }
        }}
      >
        {resetPressesLeft < resetPressRequired
          ? `Press ${resetPressesLeft} more time${resetPressesLeft > 1 ? "s" : ""} to reset...`
          : "Reset stats"}
      </button>
    </Modal>
  );
};
