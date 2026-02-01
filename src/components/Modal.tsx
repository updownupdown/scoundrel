import React, { useEffect, useRef } from "react";
import "./Modal.scss";
import clsx from "clsx";
import { CloseIcon } from "./icons/Close";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  modalClass?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  modalClass,
}: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  window.addEventListener("click", (event) => {
    const dialog = document.querySelector("dialog");
    if (event.target === dialog) {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      className={clsx("modal", modalClass, !title && "modal--no-backdrop")}
    >
      {title && (
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="dialog-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="modal-content">{children}</div>
    </dialog>
  );
};
