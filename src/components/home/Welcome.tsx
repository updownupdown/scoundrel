import "./Welcome.scss";
import { D20Icon } from "../icons/D20";
import {
  GameStates,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import type { Dispatch, SetStateAction } from "react";
import { GameModesToggle } from "../misc/GameModesToggle";
import { Modals, type ModalType } from "../modals/ModalEmbeds";

interface WelcomeProps {
  setOpenModal: (modal: ModalType) => void;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
}

export const Welcome = ({
  setOpenModal,
  playerState,
  setPlayerState,
  setDungeonState,
}: WelcomeProps) => {
  return (
    <div className="welcome">
      <div className="welcome__title">
        <D20Icon />
        <span className="welcome__title__scoundrel">
          <span className="welcome__title__scoundrel__scoundrel">
            Scoundrel
          </span>
          <span className="welcome__title__scoundrel__rogue">Rogue</span>
        </span>
      </div>

      <button
        className="plain-btn red-btn"
        onClick={() => {
          setOpenModal(Modals.HowToPlay);
        }}
      >
        How to play
      </button>

      <GameModesToggle
        initialSelection={true}
        onModeSelect={() => {}}
        playerState={playerState}
        setPlayerState={setPlayerState}
        setDungeonState={setDungeonState}
      />
    </div>
  );
};
