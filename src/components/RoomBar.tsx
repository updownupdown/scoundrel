import clsx from "clsx";
import "./HealthBar.scss";
import { defaultPlayState, GameStates, type PlayState } from "../utils/types";
import { roomsTotal } from "../utils/constants";
import { arrayShuffle, getValidRoomCards } from "../utils/utils";
import "./RoomBar.scss";
import type { Dispatch, SetStateAction } from "react";

interface RoomBarProps {
  playState: PlayState;
  setPlayState: Dispatch<SetStateAction<PlayState>>;
  resetGame: () => void;
}

export const RoomBar = ({
  playState,
  resetGame,
  setPlayState,
}: RoomBarProps) => {
  const lastRoomNumberRanFrom = playState.ranRooms.length
    ? playState.ranRooms.slice(-1)[0]
    : undefined;

  const ranLastRoom =
    lastRoomNumberRanFrom !== undefined &&
    playState.currentRoom === lastRoomNumberRanFrom;
  const canRun =
    playState.gameState === GameStates.InProgress &&
    getValidRoomCards(playState.roomCards).length === 4 &&
    !ranLastRoom;

  function runFromRoom() {
    setPlayState({
      ...playState,
      drawDeck: [
        ...playState.drawDeck,
        ...(playState.roomCards !== undefined
          ? arrayShuffle(getValidRoomCards(playState.roomCards))
          : []),
      ],
      roomCards: [],
      ranRooms: [...playState.ranRooms, playState.currentRoom ?? 1],
      isRunning: true,
    });
  }

  return (
    <div className="rooms">
      <button className="reset-btn" type="button" onClick={resetGame}>
        Reset
      </button>

      <div className="rooms__center">
        <div className="rooms__center__count">
          <span className="rooms__center__count__current">
            {playState.currentRoom ?? 1}
          </span>
          <span className="rooms__center__count__total"> / {roomsTotal}</span>
        </div>

        <div className="rooms__center__progress">
          {playState.ranRooms.map((rr) => {
            return (
              <div
                key={rr}
                className="rr"
                style={{
                  left: `${((rr - 0.5) / roomsTotal) * 100}%`,
                }}
              />
            );
          })}
          <div
            className="rooms__center__progress__bar"
            style={{
              width: `${((playState.currentRoom ?? 1) / roomsTotal) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <button
        className="run-btn"
        onClick={() => runFromRoom()}
        disabled={!canRun}
      >
        Run
      </button>
    </div>
  );
};
