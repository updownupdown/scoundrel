import React from "react";
import { Modal } from "./Modal";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal = ({ isOpen, onClose }: MenuModalProps) => {
  return (
    <Modal title="Menu" isOpen={isOpen} onClose={onClose}>
      <span>Stuff</span>
    </Modal>
  );
};
