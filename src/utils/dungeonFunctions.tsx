import type { Dispatch, SetStateAction } from "react";
import { Modals, type ModalType } from "../components/modals/ModalEmbeds";
import {
  CardTypes,
  defaultDungeonState,
  defaultInventory,
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

interface DungeonProps {
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  setOpenModal: (modaol: ModalType | undefined) => void;
}

export const useDungeon = ({
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
  setOpenModal,
}: DungeonProps) => {
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
      lastGameWon: undefined,
    }));
  }

  // Game LOSE
  function gameLose() {
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
      gameState: GameStates.Home,
      inventoryPack: defaultInventory,
      lastGameWon: false,
    }));

    setOpenModal(Modals.Home);
  }

  // Dungeon - REACH END
  function dungeonEnd() {
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
    const { avgLastRoom, avgLastDungeon, avgLastRoomAcrossDungeons } =
      getLastRoomStats();

    setDungeonState((prev) => ({
      ...prev,
      // ...defaultDungeonState,
      // drawDeck: getSafeShuffledDeck(),
      // score: dungeonState.score + dungeonState.health + dungeonState.bonusScore,
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
      lastGameWon: true,
    }));

    setOpenModal(undefined);
  }

  function openInventory() {
    setOpenModal(Modals.Inventory);
  }

  return {
    gameStart,
    gameLose,
    dungeonEnd,
    dungeonContinue,
    dungeonExit,
    openInventory,
  };
};
