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
import { Card } from "./utils/useCardSvg";
import { CardTypes } from "./utils/types";
import { DoorIcon } from "./assets/icons/Door";
import { HeartIcon } from "./assets/icons/Heart";
import { PotionIcon } from "./assets/icons/Potion";
import { SwordIcon } from "./assets/icons/Sword";
import { FistIcon } from "./assets/icons/Fist";
import { HeartOutlineIcon } from "./assets/icons/HeartOutline";
import { StatusBar } from "./components/StatusBar";
import clsx from "clsx";

type PlayState = {
  drawDeck: string[];
  discardDeck: string[];
  currentRoom?: number;
  roomCards: (string | undefined)[];
  ranRooms: number[];
  health: number;
  weapon?: string;
  weaponCards: string[];
};

function App() {
  const defaultPlayState: PlayState = {
    drawDeck: [],
    discardDeck: [],
    currentRoom: undefined,
    roomCards: [],
    ranRooms: [],
    weapon: undefined,
    weaponCards: [],
    health: 20,
  };

  const [playStateStorage, setPlayStateStorage] = useLocalStorage(
    "playState",
    defaultPlayState,
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [playState, setPlayState] = useState(playStateStorage);
  const [usedPotionInRoom, setUsedPotionInRoom] = useState(false);

  // Reset game
  function resetGame() {
    setGameStarted(false);
    setPlayState({
      ...defaultPlayState,
      drawDeck: arrayShuffle(allCards),
    });
    setGameStarted(true);
  }

  function getWeaponCardsLowest() {
    const lastWeaponCard =
      playState.weaponCards?.[playState.weaponCards.length - 1];

    if (!lastWeaponCard) return undefined;

    const { cardValue } = parseCard(lastWeaponCard);

    return cardValue;
  }

  function canUseWeapon(cardValue: number) {
    const lowestWeaponCard = getWeaponCardsLowest();
    return (
      playState.weapon &&
      (lowestWeaponCard === undefined || cardValue < lowestWeaponCard)
    );
  }

  const weaponValue = () => {
    if (!playState.weapon) return undefined;
    const { cardValue } = parseCard(playState.weapon);
    return cardValue;
  };

  const weaponStrength = () => {
    if (!playState.weapon) return undefined;

    const lowest = getWeaponCardsLowest();
    if (!lowest) return 1;

    return (lowest - 1) / maxWeaponStrength;
  };

  // Populate room
  function populateRoom() {
    const lastRoomCard = getValidRoomCards(playState.roomCards);
    const neededCards = lastRoomCard.length ? 3 : 4;
    const newRoomCards = [...playState.drawDeck.slice(0, neededCards)];

    // Keep last room card in the same position
    if (lastRoomCard.length) {
      const indexOfLastRoomCard = playState.roomCards.indexOf(lastRoomCard[0]);
      newRoomCards.splice(indexOfLastRoomCard, 0, lastRoomCard[0]);
    }

    setUsedPotionInRoom(false);
    setPlayState((prev) => ({
      ...prev,
      drawDeck: [...playState.drawDeck.slice(neededCards)],
      roomCards: newRoomCards,
      currentRoom: (playState.currentRoom ?? 0) + 1,
    }));
  }

  useEffect(() => {
    // Trigger end
    if (playState.health < 0) {
      triggerLose();
      setPlayStateStorage(playState);
      return;
    }

    if (gameStarted) {
      const validRoomCards = getValidRoomCards(playState.roomCards);

      if (playState.drawDeck.length === 0) {
        triggerWin();
      } else if (validRoomCards.length <= 1) {
        populateRoom();
      }
    }

    setPlayStateStorage(playState);
  }, [playState]);

  // Card actions
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

  function triggerLose() {
    console.log("You died!");
  }

  function triggerWin() {
    console.log("You won!");
  }

  function getDamageValue(card: string) {
    const { cardValue: monsterValue } = parseCard(card);
    const { cardValue: weaponValue } = parseCard(playState.weapon);
    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    return damage;
  }

  const lastRoomRan = playState.ranRooms.length
    ? playState.ranRooms.slice(-1)[0]
    : undefined;
  const canRun =
    playState.roomCards.length === 4 &&
    (lastRoomRan === undefined || playState.currentRoom !== lastRoomRan + 1);

  return (
    <div className="main">
      <div className="main__header">
        <button className="plain-btn" type="button">
          Menu
        </button>

        <h2>Scoundrel</h2>

        <button className="plain-btn" type="button" onClick={resetGame}>
          Reset game
        </button>
      </div>

      <div className="statuses">
        <StatusBar
          type="health"
          icon={<HeartOutlineIcon />}
          value={playState.health}
          total={maxHealth}
          progress={playState.health / maxHealth}
        />
        <StatusBar
          type="room"
          icon={<DoorIcon />}
          value={playState.currentRoom ?? 1}
          total={roomsTotal + (playState.ranRooms.length ?? 0)}
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
            <Card card={playState.weapon} />
          </div>

          <div className="weapons__separator" />

          <div className="weapons__cards">
            {playState.weaponCards.map((card, index) => {
              return <Card key={"weapon-card" + index} card={card} />;
            })}
          </div>
        </div>
      </div>

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
                    >
                      <PotionIcon />
                      <span>
                        +{usedPotionInRoom ? 0 : cardValue} <HeartIcon />
                      </span>
                    </button>
                  )}

                  {cardType === CardTypes.Weapon && (
                    <button
                      className="action-btn action-btn--equip"
                      onClick={() => doEquip(card)}
                    >
                      <SwordIcon />
                    </button>
                  )}

                  {cardType === CardTypes.Monster && (
                    <>
                      <button
                        className="action-btn action-btn--fight action-btn--fight-fist"
                        onClick={() => doFightBarefist(card)}
                      >
                        <FistIcon />
                        <span>
                          -{cardValue} <HeartIcon />
                        </span>
                      </button>
                      <button
                        className="action-btn action-btn--fight action-btn--fight-weapon"
                        onClick={() => doFightWeapon(card)}
                        disabled={!canUseWeapon(cardValue)}
                      >
                        <SwordIcon />

                        <span>
                          {canUseWeapon(cardValue) ? (
                            <>
                              {`-${getDamageValue(card)}`}
                              <HeartIcon />
                            </>
                          ) : (
                            "N/A"
                          )}
                        </span>
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
  );
}

export default App;
