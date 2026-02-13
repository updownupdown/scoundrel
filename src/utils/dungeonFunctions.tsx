import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Modals, type ModalType } from "../components/modals/ModalEmbeds";
import {
  CardTypes,
  defaultDungeonState,
  defaultInventory,
  GameModes,
  GameStates,
  ItemTypes,
  type DungeonState,
  type PlayerState,
} from "./types";
import {
  getSafeShuffledDeck,
  getValidRoomCards,
  newAvg,
  parseCard,
} from "./utils";
import { roomsTotal } from "./constants";
import { Toast } from "../components/misc/Toast";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti-boom";
import { Blood } from "../components/misc/Blood";

interface DungeonProps {
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  setOpenModal: (modaol: ModalType | undefined) => void;
}

export const toastDurationInSec = 5;
export const resetGameDelayInSec = 2;

export const useDungeon = ({
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
  setOpenModal,
}: DungeonProps) => {
  const [toasts, setToasts] = useState<{ id: number; type: string }[]>([]);

  function triggerToast({ type }: { type: string }) {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, toastDurationInSec * 1000);
  }

  const dungeonToasts = useMemo(() => {
    return (
      <div className="toasts-wrap">
        <AnimatePresence key="toasts">
          {toasts.map((t) => {
            return (
              <Toast key={t.id} type={t.type}>
                {t.type === "won" && (
                  <>
                    <h2>You made it!</h2>
                    <div className="toast__stats">
                      {playerState.gameMode === GameModes.Rogue && (
                        <span>Dungeon: {dungeonState.currentDungeon}</span>
                      )}
                      <span>Score: {dungeonState.score}</span>
                    </div>
                  </>
                )}

                {t.type === "lost" && (
                  <>
                    <h2>You died!</h2>
                    <div className="toast__stats">
                      {playerState.gameMode === GameModes.Rogue && (
                        <span>Dungeon: {dungeonState.currentDungeon}</span>
                      )}
                      <span>Room: {dungeonState.currentRoom}</span>
                      <span>Score: {dungeonState.score}</span>
                    </div>
                  </>
                )}
              </Toast>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }, [toasts]);

  // Get stats
  function getLastRoomStats() {
    return {
      avgLastRoom: newAvg(
        playerState.avgLastRoom,
        playerState.gamesWon + playerState.gamesLost,
        dungeonState.currentRoom,
      ),
      avgLastRoomAcrossDungeons: newAvg(
        playerState.avgLastRoomAcrossDungeons,
        playerState.gamesWon + playerState.gamesLost,
        dungeonState.currentRoom + dungeonState.currentDungeon * roomsTotal,
      ),
      avgLastDungeon: newAvg(
        playerState.avgLastDungeon,
        playerState.gamesWon + playerState.gamesLost,
        dungeonState.currentDungeon,
      ),
    };
  }

  // Game START
  function gameStart() {
    // console.log("gameSTART");

    setDungeonState({
      ...defaultDungeonState,
      drawDeck: getSafeShuffledDeck(),
      score: 0,
      bonusScore: 0,
      isRunning: false,
      usedPotionInRoom: false,
      currentDungeon: 1,
    });

    setPlayerState((prev) => ({
      ...prev,
      gameState: GameStates.InProgress,
    }));
  }

  // Game LOSE
  function gameLose() {
    // console.log("gameLose");

    const remainingCards = getValidRoomCards([
      ...dungeonState.drawDeck,
      ...dungeonState.roomCards,
    ]);
    let tally = 0;

    for (let i = 0; i < remainingCards.length; i++) {
      const { cardType, cardValue } = parseCard(remainingCards[i]);

      if (cardType === CardTypes.Monster) {
        tally -= cardValue;
      }
    }

    const { avgLastRoom, avgLastDungeon, avgLastRoomAcrossDungeons } =
      getLastRoomStats();

    setDungeonState((prev) => ({
      ...prev,
      score: dungeonState.score + tally,
    }));

    setPlayerState((prev) => ({
      ...prev,
      gamesLost: playerState.gamesLost + 1,
      avgLastRoom,
      avgLastDungeon,
      avgLastRoomAcrossDungeons,
      gameState:
        playerState.gameMode === GameModes.Rogue
          ? GameStates.Home
          : GameStates.Paused,
      inventoryPack: defaultInventory,
    }));

    triggerToast({ type: "lost" });
  }

  // Game - WIN
  function gameWin() {
    // console.log("gameWin");

    const { avgLastRoom, avgLastDungeon, avgLastRoomAcrossDungeons } =
      getLastRoomStats();

    // setDungeonState((prev) => ({
    //   ...prev,
    //   isRunning: false,
    //   usedPotionInRoom: false,
    //   currentDungeon: 1,
    // }));

    setPlayerState((prev) => ({
      ...prev,
      gamesWon: playerState.gamesWon + 1,
      avgLastRoom,
      avgLastDungeon,
      avgLastRoomAcrossDungeons,
      gameState: GameStates.Paused,
    }));

    triggerToast({ type: "won" });
  }

  // Dungeon - REACH END
  function dungeonEnd() {
    // console.log("dungeonEnd");

    const goldFound = dungeonState.currentDungeon;

    setDungeonState((prev) => ({
      ...prev,
      score: dungeonState.score + dungeonState.health + dungeonState.bonusScore,
      foundGold: goldFound,
    }));

    setPlayerState((prev) => ({
      ...prev,
      gameState: GameStates.DungeonEnd,
      inventoryPack: {
        ...playerState.inventoryPack,
        [ItemTypes.Coin]: playerState.inventoryPack[ItemTypes.Coin] + goldFound,
      },
    }));
  }

  // Dungeon - CONTINUE
  function dungeonContinue() {
    // console.log("dungeonContinue");

    setDungeonState({
      ...defaultDungeonState,
      drawDeck: getSafeShuffledDeck(),
      currentDungeon: dungeonState.currentDungeon + 1,
      scoreEndless: dungeonState.score,
      health: dungeonState.health,
    });

    setPlayerState((prev) => ({
      ...prev,
      gameState: GameStates.InProgress,
    }));

    setOpenModal(undefined);
  }

  // Dungeon - EXIT
  function dungeonExit() {
    // console.log("dungeonExit");

    const { avgLastRoom, avgLastDungeon, avgLastRoomAcrossDungeons } =
      getLastRoomStats();

    setDungeonState((prev) => ({
      ...prev,
      isRunning: false,
      usedPotionInRoom: false,
      currentDungeon: 1,
    }));

    setPlayerState((prev) => ({
      ...prev,
      gamesWon: playerState.gamesWon + 1,
      avgLastRoom,
      avgLastDungeon,
      avgLastRoomAcrossDungeons,
      gameState: GameStates.Home,
    }));

    triggerToast({ type: "won" });
  }

  function openInventory() {
    setOpenModal(Modals.Inventory);
  }

  return {
    dungeonToasts: dungeonToasts,
    gameWin,
    gameStart,
    gameLose,
    dungeonEnd,
    dungeonContinue,
    dungeonExit,
    openInventory,
  };
};
