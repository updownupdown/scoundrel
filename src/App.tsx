import { useEffect, useRef, useState } from "react";
import "./css/styles.scss";
import { useLocalStorage } from "./utils/hooks";
import { getValidRoomCards } from "./utils/utils";
import {
  defaultDungeonState,
  defaultPlayerState,
  GameStates,
} from "./utils/types";
import { ImagePreloader } from "./utils/ImagePreloader";
import {
  ModalEmbeds,
  Modals,
  type ModalType,
} from "./components/modals/ModalEmbeds";
import { animationCleanup } from "./utils/animations";
import { HealthBar } from "./components/dungeon/HealthBar";
import { RoomBar } from "./components/dungeon/RoomBar";
import { WeaponsBox } from "./components/dungeon/WeaponsBox";
import { DrawDeck } from "./components/dungeon/DrawDeck";
import { Actions } from "./components/dungeon/Actions";
import { Header } from "./components/dungeon/Header";
import { useDungeon } from "./utils/dungeonFunctions";
import { Card } from "./components/misc/Card";
import { Home } from "./components/home/Home";
import { currentVersion, emptyCardSymbol } from "./utils/constants";
import { Welcome } from "./components/home/Welcome";
import { Blood } from "./components/misc/Blood";
import Confetti from "react-confetti-boom";
import { CoinIcon } from "./components/icons/Coin";

function App() {
  const [initialized, setInitialized] = useState(false);
  const [versionTag, setVersionTag] = useLocalStorage<number | undefined>(
    "versionTag",
    undefined,
  );
  const [dungeonState, setDungeonState] = useLocalStorage(
    "dungeonState",
    defaultDungeonState,
  );
  const [playerState, setPlayerState] = useLocalStorage(
    "playerState",
    defaultPlayerState,
  );
  const [openModal, setOpenModal] = useState<ModalType | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapRef = useRef(null);

  const {
    gameStart,
    gameLose,
    dungeonEnd,
    dungeonContinue,
    dungeonExit,
    openInventory,
  } = useDungeon({
    playerState,
    setPlayerState,
    dungeonState,
    setDungeonState,
    setOpenModal,
  });

  // INIT
  useEffect(() => {
    if (initialized) return;

    // Reset if not same version
    if (versionTag === currentVersion) {
      setInitialized(true);
    } else {
      setDungeonState(defaultDungeonState);
      setPlayerState(defaultPlayerState);
      setVersionTag(currentVersion);
      setInitialized(true);
    }
  }, [versionTag, initialized]);

  // PLAYER GAME STATE change
  useEffect(() => {
    if (!initialized) return;

    if (playerState.gameState === GameStates.DungeonEnd) {
      setOpenModal(Modals.DungeonEnd);
    }
  }, [playerState.gameState, initialized]);

  // DUNGEON state change
  useEffect(() => {
    if (!initialized) return;

    animationCleanup();

    if (playerState.gameState !== GameStates.InProgress) return;

    if (dungeonState.health <= 0) {
      // Trigger lost
      gameLose();
      return;
    }

    const validRoomCards = getValidRoomCards(dungeonState.roomCards);

    if (dungeonState.drawDeck.length === 0 && validRoomCards.length === 0) {
      // Reach dungeon end
      dungeonEnd();
    } else if (
      dungeonState.drawDeck.length !== 0 &&
      validRoomCards.length <= 1
    ) {
      // ===== Populate room ===== //
      const lastRoomCard = getValidRoomCards(dungeonState.roomCards);
      const neededCards = lastRoomCard.length ? 3 : 4;
      const newRoomCards: string[] = [
        ...dungeonState.drawDeck.slice(0, neededCards),
      ];

      // Pad the card set to preserve last card position in last room
      while (newRoomCards.length < neededCards) {
        newRoomCards.push(emptyCardSymbol);
      }

      // Keep last room card in the same position
      if (lastRoomCard.length) {
        const indexOfLastRoomCard = dungeonState.roomCards.indexOf(
          lastRoomCard[0],
        );
        newRoomCards.splice(indexOfLastRoomCard, 0, lastRoomCard[0]);
      }

      setDungeonState((prev) => ({
        ...prev,
        drawDeck: [...dungeonState.drawDeck.slice(neededCards)],
        roomCards: newRoomCards,
        currentRoom:
          dungeonState.currentRoom + (dungeonState.isRunning ? 0 : 1),
        isRunning: false,
        usedPotionInRoom: false,
      }));
      // ========================= //
    }
  }, [dungeonState, initialized]);

  const PlusCoins = () => {
    return (
      <div className="plus-coins">
        <span>5</span>
        <CoinIcon />
      </div>
    );
  };

  return (
    <div
      ref={wrapRef}
      className={`wrap game-state--${playerState.gameState?.toLowerCase() ?? "na"}`}
    >
      {/* Image Preloader */}
      <ImagePreloader />

      {/* Modals */}
      <ModalEmbeds
        openModal={openModal}
        dungeonState={dungeonState}
        setDungeonState={setDungeonState}
        setOpenModal={setOpenModal}
        playerState={playerState}
        setPlayerState={setPlayerState}
        gameStart={gameStart}
        dungeonContinue={dungeonContinue}
        dungeonExit={dungeonExit}
        openInventory={openInventory}
      />

      {/* Blood */}
      {playerState.gameState === GameStates.Home &&
        playerState.lastGameWon === false && <Blood />}

      {playerState.gameState === GameStates.Home &&
        playerState.lastGameWon === true && (
          <div className="confetti">
            <Confetti
              mode="boom"
              y={0.35}
              particleCount={80}
              colors={["#b43733", "#da8037", "#52a3c4", "#8956b9", "#4ea069"]}
            />
          </div>
        )}

      <div className="main">
        <Header setOpenModal={setOpenModal} />

        <div className="main__body">
          {/* Welcome */}
          {playerState.gameState === GameStates.Welcome && (
            <Welcome setPlayerState={setPlayerState} />
          )}

          {/* Home */}
          {playerState.gameState === GameStates.Home && (
            <Home
              dungeonState={dungeonState}
              playerState={playerState}
              setPlayerState={setPlayerState}
              gameStart={gameStart}
            />
          )}

          {/* Dungeon */}
          {playerState.gameState === GameStates.InProgress && (
            <>
              <HealthBar dungeonState={dungeonState} />

              <div className="deck-and-weapons">
                <WeaponsBox dungeonState={dungeonState} />
                <DrawDeck
                  dungeonState={dungeonState}
                  setOpenModal={setOpenModal}
                />
              </div>

              <RoomBar
                dungeonState={dungeonState}
                playerState={playerState}
                setDungeonState={setDungeonState}
                openInventory={openInventory}
              />

              <div className="room-and-actions">
                <div className="room-cards">
                  {dungeonState.roomCards.map((card, index) => {
                    return <Card key={"card" + index} card={card} />;
                  })}
                </div>

                <Actions
                  dungeonState={dungeonState}
                  setDungeonState={setDungeonState}
                  playerState={playerState}
                  setPlayerState={setPlayerState}
                  isAnimating={isAnimating}
                  setIsAnimating={setIsAnimating}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
