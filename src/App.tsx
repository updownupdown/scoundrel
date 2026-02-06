import { useEffect, useRef, useState } from "react";
import "./css/styles.scss";
import { useLocalStorage } from "./utils/hooks";
import { allCards, maxHealth, roomsTotal } from "./utils/constants";
import { arrayShuffle, getValidRoomCards, parseCard } from "./utils/utils";
import {
  CardTypes,
  defaultPlayState,
  GameStates,
  type PlayState,
} from "./utils/types";
import { HeartIcon } from "./components/icons/Heart";
import { SwordIcon } from "./components/icons/Sword";
import clsx from "clsx";
import { ImagePreloader } from "./utils/ImagePreloader";
import { Blood } from "./components/Blood";
import Confetti from "react-confetti-boom";
import {
  ModalEmbeds,
  Modals,
  type ModalType,
} from "./components/modals/ModalEmbeds";
import { Card } from "./components/Card";
import { MenuIcon } from "./components/icons/Menu";
import { animationCleanup } from "./utils/animations";
import { D20Icon } from "./components/icons/D20";
import { HealthBar } from "./components/HealthBar";
import { RoomBar } from "./components/RoomBar";
import { WeaponsBox } from "./components/WeaponsBox";
import { DrawDeck } from "./components/DrawDeck";
import { Actions } from "./components/Actions";

function App() {
  const [playState, setPlayState] = useLocalStorage(
    "playState",
    defaultPlayState,
  );
  const [openModal, setOpenModal] = useState<ModalType | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapRef = useRef(null);

  // Reset game
  function resetGame() {
    setPlayState({
      ...defaultPlayState,
      drawDeck: arrayShuffle(allCards),
      gameState: GameStates.InProgress,
      score: 0,
      bonusScore: 0,
      isRunning: false,
      usedPotionInRoom: false,
    });
  }

  // Lose game
  function gameLose() {
    setOpenModal(Modals.Lost);

    const remainingCards = getValidRoomCards([
      ...playState.drawDeck,
      ...playState.roomCards,
    ]);
    let tally = 0;

    for (let i = 0; i < remainingCards.length; i++) {
      const { cardType, cardValue } = parseCard(remainingCards[i]);

      if (cardType === CardTypes.Monster) {
        tally -= cardValue;
      }
    }

    setPlayState((prev) => ({
      ...prev,
      gameState: GameStates.Lost,
      score: tally,
    }));
  }

  // WIn game
  function gameWin() {
    setOpenModal(Modals.Won);

    setPlayState((prev) => ({
      ...prev,
      gameState: GameStates.Won,
      score: playState.health + playState.bonusScore,
    }));
  }

  // UseEffect
  useEffect(() => {
    animationCleanup();

    if (playState.gameState === undefined) {
      // Initial game
      resetGame();
    } else if (playState.gameState === GameStates.InProgress) {
      if (playState.health <= 0) {
        // Trigger lost
        gameLose();
        return;
      }

      const validRoomCards = getValidRoomCards(playState.roomCards);

      if (playState.drawDeck.length === 0 && validRoomCards.length === 0) {
        // Trigger win
        gameWin();
      } else if (
        playState.drawDeck.length !== 0 &&
        validRoomCards.length <= 1
      ) {
        // Populate room
        const lastRoomCard = getValidRoomCards(playState.roomCards);
        const neededCards = lastRoomCard.length ? 3 : 4;
        const newRoomCards: (string | undefined)[] = [
          ...playState.drawDeck.slice(0, neededCards),
        ];

        // Pad the card set to preserve last card position in last room
        while (newRoomCards.length < neededCards) {
          newRoomCards.push(undefined);
        }

        // Keep last room card in the same position
        if (lastRoomCard.length) {
          const indexOfLastRoomCard = playState.roomCards.indexOf(
            lastRoomCard[0],
          );
          newRoomCards.splice(indexOfLastRoomCard, 0, lastRoomCard[0]);
        }

        setPlayState((prev) => ({
          ...prev,
          drawDeck: [...playState.drawDeck.slice(neededCards)],
          roomCards: newRoomCards,
          currentRoom: playState.isRunning
            ? playState.currentRoom
            : (playState.currentRoom ?? 0) + 1,
          isRunning: false,
          usedPotionInRoom: false,
        }));
      }
    }
  }, [playState]);

  return (
    <div
      ref={wrapRef}
      className={`wrap game-state--${playState.gameState?.toLowerCase() ?? "na"}`}
    >
      {/* Image Preloader */}
      <ImagePreloader />

      {/* Modals */}
      <ModalEmbeds
        playState={playState}
        setPlayState={setPlayState}
        resetGame={resetGame}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      {/* Blood and confetti */}
      {playState.gameState === GameStates.Lost && <Blood />}
      {playState.gameState === GameStates.Won && (
        <div className="confetti">
          <Confetti
            mode="fall"
            particleCount={80}
            colors={["#b43733", "#da8037", "#52a3c4", "#8956b9", "#4ea069"]}
          />
        </div>
      )}

      {/* Main */}
      <div className="main">
        <div className="header">
          <div className="header__title">
            <D20Icon />
            <span className="header__title__scoundrel">Scoundrel</span>
            <span className="header__title__mode">&nbsp;Classic</span>
          </div>

          <button
            className="menu-btn"
            type="button"
            onClick={() => {
              setOpenModal(Modals.Menu);
            }}
          >
            <span>Menu</span>
            <MenuIcon />
          </button>
        </div>

        <div className="main__body">
          <HealthBar playState={playState} />

          <div className="deck-and-weapons">
            <WeaponsBox playState={playState} />
            <DrawDeck playState={playState} setOpenModal={setOpenModal} />
          </div>

          <RoomBar
            playState={playState}
            setPlayState={setPlayState}
            resetGame={resetGame}
          />

          <div className="room-and-actions">
            <div className="room-cards">
              {playState.roomCards.map((card, index) => {
                return <Card key={"card" + index} card={card} />;
              })}
            </div>

            <Actions
              playState={playState}
              setPlayState={setPlayState}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
