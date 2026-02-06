import { createContext, useContext } from "react";
import { Modal } from "../components/modals/Modal";
import { PlayContext } from "./PlayContext";
import { DeckModal } from "../components/modals/DeckModal";
import { MenuModal } from "../components/modals/MenuModal";

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

export const ModalEmbeds = () => {
  const { state, gameReset } = useContext(PlayContext);
  const { openModal, setOpenModal } = useContext(ModalContext);

  return (
    <>
      {openModal === Modals.Menu && (
        <MenuModal
          isOpen={true}
          onClose={() => {
            setOpenModal(undefined);
          }}
        />
      )}

      {openModal === Modals.Deck && (
        <DeckModal
          isOpen
          onClose={() => {
            setOpenModal(undefined);
          }}
          drawDeck={state.drawDeck}
        />
      )}

      {openModal === Modals.Won && (
        <Modal
          isOpen
          onClose={() => {
            setOpenModal(undefined);
          }}
        >
          <div className="win-lose-text">
            <h2 className="color-green">You won!</h2>
            <h5>Score: {state.score}</h5>
            <button
              className="plain-btn"
              onClick={() => {
                gameReset();
                setOpenModal(undefined);
              }}
            >
              Play again
            </button>
          </div>
        </Modal>
      )}

      {openModal === Modals.Lost && (
        <Modal
          isOpen
          onClose={() => {
            setOpenModal(undefined);
          }}
        >
          <div className="win-lose-text">
            <h2 className="color-red">You died!</h2>
            <h5>Score: {state.score}</h5>
            <button
              className="plain-btn"
              onClick={() => {
                gameReset();
                setOpenModal(undefined);
              }}
            >
              Try again
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
