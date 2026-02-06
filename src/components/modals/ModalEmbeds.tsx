import { Modal } from "./Modal";
import { DeckModal } from "./DeckModal";
import { MenuModal } from "./MenuModal";
import type { PlayState } from "../../utils/types";
import { WelcomeModal } from "./WelcomeModal";
import type { Dispatch, SetStateAction } from "react";

export const Modals = {
  Welcome: "Welcome",
  Won: "Won",
  Lost: "Lost",
  Menu: "Menu",
  Deck: "Deck",
} as const;

export type ModalType = (typeof Modals)[keyof typeof Modals];

interface ModalEmbedsProps {
  playState: PlayState;
  setPlayState: Dispatch<SetStateAction<PlayState>>;
  resetGame: () => void;
  openModal?: ModalType;
  setOpenModal: (modal: ModalType | undefined) => void;
}

export const ModalEmbeds = ({
  playState,
  setPlayState,
  resetGame,
  openModal,
  setOpenModal,
}: ModalEmbedsProps) => {
  return (
    <>
      {openModal === Modals.Welcome && (
        <WelcomeModal
          isOpen
          onClose={() => {
            setOpenModal(undefined);
          }}
          setOpenModal={setOpenModal}
        />
      )}

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
          drawDeck={playState.drawDeck}
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
            <h5>Score: {playState.score}</h5>
            <button
              className="plain-btn"
              onClick={() => {
                resetGame();
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
            <h5>Score: {playState.score}</h5>
            <button
              className="plain-btn"
              onClick={() => {
                resetGame();
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
