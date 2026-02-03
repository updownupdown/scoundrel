import { createContext } from "react";

export const Modals = {
  Won: "Won",
  Lost: "Lost",
  Menu: "Menu",
  Deck: "Deck",
} as const;

export type ModalType = (typeof Modals)[keyof typeof Modals];

interface IModalContext {
  openModal: ModalType | undefined;
  setOpenModal: (modal: ModalType | undefined) => void;
}

export const ModalContext = createContext<IModalContext>({
  openModal: undefined,
  setOpenModal: () => {},
});
