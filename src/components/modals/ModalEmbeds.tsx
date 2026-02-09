import { Modal } from "./Modal";
import { DeckModal } from "./DeckModal";
import { AboutModal } from "./AboutModal";
import type {
  DungeonState,
  PlayerState as PlayerState,
} from "../../utils/types";
import type { Dispatch, SetStateAction } from "react";
import { StatsModal } from "./StatsModal";
import { DungeonEndModal } from "./DungeonEndModal";
import { InventoryModal } from "./InventoryModal";
import { HowToPlayModal } from "./HowToPlayModal";

export const Modals = {
  HowToPlay: "How to Play",
  About: "About and Credits",
  Stats: "Stats",
  Deck: "Deck",
  DungeonEnd: "Dungeon End",
  Inventory: "Inventory",
  Home: "Home",
} as const;

export type ModalType = (typeof Modals)[keyof typeof Modals];

interface ModalEmbedsProps {
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  openModal?: ModalType;
  setOpenModal: (modal: ModalType | undefined) => void;
  dungeonExit: () => void;
  dungeonContinue: () => void;
  gameStart: () => void;
  openInventory: () => void;
}

export const ModalEmbeds = ({
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
  openModal,
  setOpenModal,
  dungeonExit,
  dungeonContinue,
}: ModalEmbedsProps) => {
  return (
    <>
      {openModal === Modals.HowToPlay && (
        <HowToPlayModal
          onClose={() => {
            setOpenModal(undefined);
          }}
        />
      )}

      {openModal === Modals.Stats && (
        <StatsModal
          onClose={() => {
            setOpenModal(undefined);
          }}
          playerState={playerState}
          setPlayerState={setPlayerState}
        />
      )}

      {openModal === Modals.About && (
        <AboutModal
          onClose={() => {
            setOpenModal(undefined);
          }}
        />
      )}

      {openModal === Modals.Deck && (
        <DeckModal
          onClose={() => {
            setOpenModal(undefined);
          }}
          drawDeck={dungeonState.drawDeck}
        />
      )}

      {openModal === Modals.DungeonEnd && (
        <DungeonEndModal
          setOpenModal={setOpenModal}
          dungeonState={dungeonState}
          dungeonContinue={dungeonContinue}
          dungeonExit={dungeonExit}
          playerState={playerState}
        />
      )}

      {openModal === Modals.Inventory && (
        <InventoryModal
          onClose={() => {
            setOpenModal(undefined);
          }}
          dungeonState={dungeonState}
          playerState={playerState}
          setPlayerState={setPlayerState}
          setDungeonState={setDungeonState}
        />
      )}
    </>
  );
};
