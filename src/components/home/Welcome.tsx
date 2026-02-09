import "./Welcome.scss";
import { D20Icon } from "../icons/D20";
import {
  GameStates,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import type { Dispatch, SetStateAction } from "react";
import { HowToPlay } from "../misc/HowToPlay";

interface WelcomeProps {
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

export const Welcome = ({ setPlayerState }: WelcomeProps) => {
  return (
    <div className="welcome">
      <div className="welcome__title">
        <D20Icon />
        <span className="welcome__title__scoundrel">Scoundrel</span>
      </div>

      <div className="welcome__how-to-play">
        <div className="welcome__how-to-play__shadow" />
        <div className="welcome__how-to-play__text">
          <HowToPlay />
        </div>
      </div>

      <button
        className="plain-btn red-btn large-btn"
        onClick={() => {
          setPlayerState((prev) => ({
            ...prev,
            gameState: GameStates.Home,
          }));
        }}
      >
        Start
      </button>
    </div>
  );
};
