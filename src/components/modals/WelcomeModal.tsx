import React from "react";
import { Modal } from "./Modal";
import { Modals, type ModalType } from "./ModalEmbeds";
import "./WelcomeModal.scss";
import { D20Icon } from "../icons/D20";

interface WelcomeModalProps {
  isOpen: boolean;
  setOpenModal: (modal: ModalType | undefined) => void;
  onClose: () => void;
}

export const WelcomeModal = ({
  isOpen,
  setOpenModal,
  onClose,
}: WelcomeModalProps) => {
  return (
    <Modal title=" " isOpen={isOpen} onClose={onClose}>
      <div className="welcome">
        <div className="welcome__title">
          <D20Icon />
          <span className="welcome__title__scoundrel">Scoundrel</span>
          {/* <span className="welcome__title__mode">Classic</span> */}
        </div>

        <button
          className="plain-btn green-btn"
          onClick={() => setOpenModal(undefined)}
        >
          Start a Game
        </button>
        <button
          className="plain-btn"
          onClick={() => setOpenModal(Modals.HowToPlay)}
        >
          How to play
        </button>
      </div>
    </Modal>
  );
};
