import { Modal } from "./Modal";
import { HowToPlay } from "../misc/HowToPlay";

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlayModal = ({ onClose }: HowToPlayProps) => {
  return (
    <Modal title="How to Play" isOpen onClose={onClose}>
      <HowToPlay />
    </Modal>
  );
};
