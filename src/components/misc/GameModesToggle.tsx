import type { Dispatch, SetStateAction } from "react";
import {
  defaultDungeonState,
  defaultPlayerState,
  GameModes,
  GameStates,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import "./GamesModesToggle.scss";

interface GameModesToggleProps {
  initialSelection: boolean;
  onModeSelect: () => void;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
}

export const GameModesToggle = ({
  initialSelection,
  onModeSelect,
  playerState,
  setPlayerState,
  setDungeonState,
}: GameModesToggleProps) => {
  const currentMode = playerState.gameMode;

  const buttonFirstWord = !!currentMode ? "Switch to" : "Select";

  return (
    <div className="game-modes-toggle">
      <h3>Classic</h3>
      <p>A strict intepretation of the original rules.</p>
      <button
        className="plain-btn"
        onClick={() => {
          if (initialSelection) {
            setPlayerState((prev) => ({
              ...prev,
              gameMode: GameModes.Classic,
            }));
          } else {
            setPlayerState((prev) => ({
              ...prev,
              ...defaultPlayerState,
              gameMode: GameModes.Classic,
            }));
            setDungeonState(defaultDungeonState);
          }

          onModeSelect();
        }}
      >
        {buttonFirstWord} Classic mode
      </button>

      <h3>Mercy</h3>
      <p>
        First deal is ensured not to be deadly, runs can be reset, and multiple
        potions can be used in the same room.
      </p>
      <button
        className="plain-btn"
        onClick={() => {
          if (initialSelection) {
            setPlayerState((prev) => ({
              ...prev,
              gameMode: GameModes.Mercy,
            }));
          } else {
            setPlayerState((prev) => ({
              ...prev,
              ...defaultPlayerState,
              gameMode: GameModes.Mercy,
            }));
            setDungeonState(defaultDungeonState);
          }

          onModeSelect();
        }}
      >
        {buttonFirstWord} Mercy mode
      </button>

      <h3>Rogue</h3>
      <p>
        Play across multiple dungeons, and collect items and XP along the way to
        upgrade your character and equipment.
      </p>
      <button
        className="plain-btn"
        onClick={() => {
          if (initialSelection) {
            setPlayerState((prev) => ({
              ...prev,
              gameMode: GameModes.Rogue,
            }));
          } else {
            setPlayerState((prev) => ({
              ...prev,
              ...defaultPlayerState,
              gameMode: GameModes.Rogue,
            }));
            setDungeonState(defaultDungeonState);
          }

          onModeSelect();
        }}
      >
        {buttonFirstWord} Rogue mode
      </button>
    </div>
  );
};
