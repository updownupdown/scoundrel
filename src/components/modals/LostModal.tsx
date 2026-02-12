import React from "react";
import { Modal } from "./Modal";
import type { DungeonState } from "../../utils/types";
import { Blood } from "../misc/Blood";

interface LostModalProps {
  onClose: () => void;
  dungeonState: DungeonState;
}

export const LostModal = ({ dungeonState, onClose }: LostModalProps) => {
  return (
    <>
      {/* <Blood /> */}

      {/* <Modal isOpen onClose={onClose}> */}
      <div className="won-lost-box">
        <h2>You died!</h2>
        <div className="won-lost-text__stats">
          <span>Dungeon: {dungeonState.currentDungeon}</span>
          <span>Room: {dungeonState.currentRoom}</span>
          <span>Score: {dungeonState.score}</span>
        </div>
      </div>
      {/* </Modal> */}
    </>
  );
};
