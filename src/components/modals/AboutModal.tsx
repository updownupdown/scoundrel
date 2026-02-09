import React from "react";
import { Modal } from "./Modal";

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal = ({ onClose }: AboutModalProps) => {
  return (
    <Modal title="About & Credits" isOpen onClose={onClose}>
      <h3>About</h3>
      <p>
        Developed by James Carmichael.
        <br />
        <a href="https://github.com/updownupdown/scoundrel" target="_blank">
          View source code on GitHub
        </a>
      </p>

      <h3>Credits</h3>
      <p>
        Original game by Zach Gage and Kurt Bieg.
        <br />
        <a href="https://scoundrel-vanilla.netlify.app/" target="_blank">
          Inspired by this implementation.
        </a>
      </p>
    </Modal>
  );
};
