import React from "react";
import { Modal } from "./Modal";
import { Modals, type ModalType } from "./ModalEmbeds";

interface WelcomeModalProps {
  isOpen: boolean;
  setOpenModal: (modal: ModalType) => void;
  onClose: () => void;
}

export const WelcomeModal = ({
  isOpen,
  setOpenModal,
  onClose,
}: WelcomeModalProps) => {
  return (
    <Modal title="Welcome" isOpen={isOpen} onClose={onClose}>
      <h2>Welcome</h2>

      <button onClick={() => setOpenModal(Modals.Menu)}>How to play</button>
    </Modal>
  );
};
