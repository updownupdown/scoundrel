import "./HealthBar.scss";
import {
  GameStates,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import { roomsTotal } from "../../utils/constants";
import { arrayShuffle, getValidRoomCards } from "../../utils/utils";
import "./RoomBar.scss";
import type { Dispatch, SetStateAction } from "react";
import { BackpackIcon } from "../icons/Backpack";

interface RoomBarProps {
  openInventory: () => void;
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
}

export const RoomBar = ({
  openInventory,
  dungeonState,
  playerState,
  setDungeonState,
}: RoomBarProps) => {
  const lastRoomNumberRanFrom = dungeonState.ranRooms.length
    ? dungeonState.ranRooms.slice(-1)[0]
    : undefined;

  const ranLastRoom =
    lastRoomNumberRanFrom !== undefined &&
    dungeonState.currentRoom === lastRoomNumberRanFrom;
  const canRun =
    playerState.gameState === GameStates.InProgress &&
    getValidRoomCards(dungeonState.roomCards).length === 4 &&
    !ranLastRoom;

  function runFromRoom() {
    setDungeonState({
      ...dungeonState,
      drawDeck: [
        ...dungeonState.drawDeck,
        ...(dungeonState.roomCards !== undefined
          ? arrayShuffle(getValidRoomCards(dungeonState.roomCards))
          : []),
      ],
      roomCards: [],
      ranRooms: [...dungeonState.ranRooms, dungeonState.currentRoom ?? 1],
      isRunning: true,
    });
  }

  return (
    <div className="rooms">
      <button
        className="plain-btn transparent-btn"
        onClick={() => openInventory()}
      >
        <BackpackIcon />
      </button>

      <div className="rooms__center">
        <div className="rooms__center__count">
          <span>
            <span className="pale">Dungeon</span>
            {dungeonState.currentDungeon}
          </span>
          <span>
            <span className="pale">Room</span>
            {dungeonState.currentRoom ?? 1}
          </span>
        </div>

        <div className="rooms__center__playerState">
          {dungeonState.ranRooms.map((rr) => {
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
            className="rooms__center__playerState__bar"
            style={{
              width: `${((dungeonState.currentRoom ?? 1) / roomsTotal) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <button
        className="plain-btn orange-btn"
        onClick={() => runFromRoom()}
        disabled={!canRun}
      >
        Run
      </button>
    </div>
  );
};
