import { useEffect, useRef, useState } from "react";
import "./css/styles.scss";
import { useLocalStorage } from "./utils/hooks";
import {
  allCards,
  maxHealth,
  maxWeaponStrength,
  roomsTotal,
} from "./utils/constants";
import { arrayShuffle, getValidRoomCards, parseCard } from "./utils/utils";
import {
  CardTypes,
  defaultPlayState,
  GameStates,
  type GameState,
} from "./utils/types";
import { DoorIcon } from "./components/icons/Door";
import { HeartIcon } from "./components/icons/Heart";
import { PotionIcon } from "./components/icons/Potion";
import { SwordIcon } from "./components/icons/Sword";
import { FistIcon } from "./components/icons/Fist";
import { StatusBar } from "./components/StatusBar";
import clsx from "clsx";
import { ImagePreloader } from "./utils/ImagePreloader";
import { Blood } from "./components/Blood";
import Confetti from "react-confetti-boom";
import { Modals, type ModalType } from "./context/ModalContext";
import { Modal } from "./components/Modal";
import { EquipIcon } from "./components/icons/Equip";
import { Card } from "./components/Card";
import { MenuModal } from "./components/MenuModal";
import { MenuIcon } from "./components/icons/Menu";
import { DragonIcon } from "./components/icons/Dragon";

function App() {
  const [playStateStorage, setPlayStateStorage] = useLocalStorage(
    "playState",
    defaultPlayState,
  );
  const [playState, setPlayState] = useState(playStateStorage);
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [usedPotionInRoom, setUsedPotionInRoom] = useState(false);
  const [openModal, setOpenModal] = useState<ModalType | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);

  // ===================================
  // Info
  // ===================================
  const lowestWeaponCard = () => {
    const lastWeaponCard =
      playState.weaponCards?.[playState.weaponCards.length - 1];
    if (!lastWeaponCard) return undefined;
    const { cardValue } = parseCard(lastWeaponCard);
    return cardValue;
  };

  function canUseWeapon(cardValue: number) {
    const lowestWeapon = lowestWeaponCard();
    return (
      playState.weapon &&
      (lowestWeapon === undefined || cardValue < lowestWeapon)
    );
  }

  const weaponValue = () => {
    if (!playState.weapon) return undefined;
    const { cardValue } = parseCard(playState.weapon);
    return cardValue;
  };

  const weaponStrength = () => {
    if (!playState.weapon) return undefined;

    const lowest = lowestWeaponCard();
    if (!lowest) return 1;

    return (lowest - 1) / maxWeaponStrength;
  };

  function getDamageValue(card: string) {
    const { cardValue: monsterValue } = parseCard(card);
    const { cardValue: weaponValue } = parseCard(playState.weapon);
    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    return damage;
  }

  const lastRoomNumberRanFrom = playState.ranRooms.length
    ? playState.ranRooms.slice(-1)[0]
    : undefined;
  const ranLastRoom =
    lastRoomNumberRanFrom !== undefined &&
    playState.currentRoom === lastRoomNumberRanFrom;
  const canRun =
    gameState === GameStates.InProgress &&
    getValidRoomCards(playState.roomCards).length === 4 &&
    !ranLastRoom;

  // ===================================
  // Start/stop win/lose logic
  // ===================================
  function gameReset() {
    setPlayState({
      ...defaultPlayState,
      drawDeck: arrayShuffle(allCards),
    });
    setGameState(GameStates.InProgress);
    setScore(0);
    setBonusScore(0);
    setIsRunning(false);
    setUsedPotionInRoom(false);
  }

  function gameLose() {
    setGameState(GameStates.Lost);
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

    setScore(tally);
  }

  function gameWin() {
    setGameState(GameStates.Won);
    setOpenModal(Modals.Won);
    setScore(playState.health + bonusScore);
  }

  useEffect(() => {
    if (gameState === undefined) {
      // Initial game
      gameReset();
    } else if (playState.health <= 0) {
      // Trigger lost
      gameLose();
    } else if (gameState === GameStates.InProgress) {
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
          currentRoom: isRunning
            ? playState.currentRoom
            : (playState.currentRoom ?? 0) + 1,
        }));
        setUsedPotionInRoom(false);
        setIsRunning(false);
      }
    }

    setPlayStateStorage(playState);
  }, [playState]);

  // ===================================
  // Card actions
  // ===================================
  function discardFromRoom(card: string) {
    setPlayState((prev) => ({
      ...prev,
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
      discardDeck: [...playState.discardDeck, card],
    }));
  }

  function removeFromRoom(card: string) {
    setPlayState((prev) => ({
      ...prev,
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
    }));
  }

  function doHeal(card: string) {
    const { cardValue } = parseCard(card);

    let health = playState.health + cardValue;
    if (health > maxHealth) health = maxHealth;

    setUsedPotionInRoom(true);
    setPlayState((prev) => ({
      ...prev,
      health,
    }));

    // Bonus score if applicable
    if (
      playState.drawDeck.length === 0 &&
      playState.roomCards.length === 0 &&
      playState.health === maxHealth
    ) {
      setBonusScore(cardValue);
    }

    discardFromRoom(card);
  }

  function doEquip(card: string) {
    setPlayState((prev) => ({
      ...prev,
      // Discard previous weapons and weapon cards
      discardDeck: [
        ...playState.discardDeck,
        ...(playState.weapon !== undefined ? [playState.weapon] : []),
        ...(playState.weaponCards !== undefined ? playState.weaponCards : []),
      ],
      // Equip current
      weapon: card,
      weaponCards: [],
    }));

    removeFromRoom(card);
  }

  function doFightWeapon(card: string) {
    const { cardValue: monsterValue } = parseCard(card);

    if (!playState.weapon) return;
    const { cardValue: weaponValue } = parseCard(playState.weapon);

    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    let health = playState.health - damage;
    if (health < 0) health = 0;

    setPlayState((prev) => ({
      ...prev,
      health,
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
      weaponCards: [...playState.weaponCards, card],
    }));
  }

  function doFightBarefist(card: string) {
    const { cardValue } = parseCard(card);

    let health = playState.health - cardValue;
    if (health < 0) health = 0;

    setPlayState((prev) => ({
      ...prev,
      health,
    }));

    discardFromRoom(card);
  }

  function runFromRoom() {
    setIsRunning(true);
    setPlayState((prev) => ({
      ...prev,
      drawDeck: [
        ...playState.drawDeck,
        ...(playState.roomCards !== undefined
          ? arrayShuffle(getValidRoomCards(playState.roomCards))
          : []),
      ],
      roomCards: [],
      ranRooms: [...playState.ranRooms, playState.currentRoom ?? 1],
    }));
  }

  return (
    <div className={`wrap game-state--${gameState?.toLowerCase() ?? "na"}`}>
      {gameState === GameStates.Lost && <Blood />}
      {gameState === GameStates.Won && (
        <div className="confetti">
          <Confetti
            mode="fall"
            particleCount={80}
            colors={["#b43733", "#da8037", "#52a3c4", "#8956b9", "#4ea069"]}
          />
        </div>
      )}

      <div className="main">
        <ImagePreloader />

        <div className="main__header">
          <button
            className="menu-btn"
            type="button"
            onClick={() => {
              setOpenModal(Modals.Menu);
            }}
          >
            <MenuIcon />
          </button>

          <h2>Scoundrel</h2>

          <button className="plain-btn" type="button" onClick={gameReset}>
            Reset game
          </button>
        </div>

        <div className="main__body">
          <div className="statuses">
            <StatusBar
              type="health"
              icon={<HeartIcon />}
              value={playState.health}
              total={maxHealth}
              progress={playState.health / maxHealth}
            />
            <StatusBar
              type="room"
              icon={<DoorIcon />}
              value={playState.currentRoom ?? 1}
              total={roomsTotal}
              progress={(playState.currentRoom ?? 1) / roomsTotal}
            >
              <button
                className="run-btn"
                onClick={() => runFromRoom()}
                disabled={!canRun}
              >
                Run
              </button>
            </StatusBar>
            <StatusBar
              type="weapon"
              icon={<SwordIcon />}
              value={weaponValue()}
              total={maxWeaponStrength}
              progress={weaponStrength()}
            />
          </div>

          <div className="status">
            <div className="draw-deck">
              <span>{playState.drawDeck.length}</span>

              <Card card="back" />
            </div>

            <div className="weapons">
              <div className="weapons__weapon">
                {!playState.weapon && <SwordIcon />}

                <Card card={playState.weapon} />
              </div>

              <div className="weapons__separator" />

              <div className="weapons__cards">
                <DragonIcon />

                {playState.weaponCards.map((card, index) => {
                  return <Card key={"weapon-card" + index} card={card} />;
                })}
              </div>
            </div>
          </div>

          <div className="room-and-actions">
            <div className="room-cards">
              {playState.roomCards.map((card, index) => {
                return <Card key={"card" + index} card={card} />;
              })}
            </div>

            <div className="actions">
              {playState.roomCards.map((card, index) => {
                const { cardType, cardValue } = parseCard(card);

                return (
                  <div key={"action" + index} className="actions__buttons">
                    {card ? (
                      <>
                        {cardType === CardTypes.Potion && (
                          <button
                            className={clsx(
                              "action-btn action-btn--heal",
                              usedPotionInRoom && "action-btn--heal-no-effect",
                            )}
                            onClick={() => doHeal(card)}
                            disabled={gameState !== GameStates.InProgress}
                          >
                            <PotionIcon />
                            <span>+{usedPotionInRoom ? 0 : cardValue}</span>
                          </button>
                        )}

                        {cardType === CardTypes.Weapon && (
                          <button
                            className="action-btn action-btn--equip"
                            onClick={() => doEquip(card)}
                          >
                            <EquipIcon />
                          </button>
                        )}

                        {cardType === CardTypes.Monster && (
                          <>
                            <button
                              className="action-btn action-btn--fight action-btn--fight-weapon"
                              onClick={() => doFightWeapon(card)}
                              disabled={
                                !canUseWeapon(cardValue) ||
                                gameState !== GameStates.InProgress
                              }
                            >
                              <SwordIcon />
                              <span>
                                {canUseWeapon(cardValue)
                                  ? `-${getDamageValue(card)}`
                                  : "--"}
                              </span>
                            </button>
                            <button
                              className="action-btn action-btn--fight action-btn--fight-fist"
                              onClick={() => doFightBarefist(card)}
                              disabled={gameState !== GameStates.InProgress}
                            >
                              <FistIcon />
                              <span>-{cardValue}</span>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openModal === Modals.Won}
        onClose={() => {
          setOpenModal(undefined);
        }}
      >
        <div className="win-lose-text">
          <h2 className="color-green">You won!</h2>
          <h5>Score: {score}</h5>
          <button
            className="plain-btn"
            onClick={() => {
              gameReset();
              setOpenModal(undefined);
            }}
          >
            Play again
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openModal === Modals.Lost}
        onClose={() => {
          setOpenModal(undefined);
        }}
      >
        <div className="win-lose-text">
          <h2 className="color-red">You died!</h2>
          <h5>Score: {score}</h5>
          <button
            className="plain-btn"
            onClick={() => {
              gameReset();
              setOpenModal(undefined);
            }}
          >
            Try again
          </button>
        </div>
      </Modal>

      {openModal === Modals.Menu && (
        <MenuModal
          isOpen={true}
          onClose={() => {
            setOpenModal(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;
