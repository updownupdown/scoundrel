import { useEffect, useRef, useState } from "react";
import "./css/styles.scss";
import { useLocalStorage } from "./utils/hooks";
import { allCards, maxHealth, roomsTotal } from "./utils/constants";
import { arrayShuffle, getValidRoomCards, parseCard } from "./utils/utils";
import { CardTypes, defaultPlayState, GameStates } from "./utils/types";
import { HeartIcon } from "./components/icons/Heart";
import { SwordIcon } from "./components/icons/Sword";
import clsx from "clsx";
import { ImagePreloader } from "./utils/ImagePreloader";
import { Blood } from "./components/Blood";
import Confetti from "react-confetti-boom";
import {
  ModalContext,
  ModalEmbeds,
  Modals,
  type ModalType,
} from "./context/ModalContext";
import { Card } from "./components/Card";
import { MenuIcon } from "./components/icons/Menu";
import { DragonIcon } from "./components/icons/Dragon";
import { ActionButton } from "./components/ActionButton";
import { animateCard, animationCleanup } from "./utils/animations";
import { D20Icon } from "./components/icons/D20";
import { PlayContext } from "./context/PlayContext";

function App() {
  const [playStateStorage, setPlayStateStorage] = useLocalStorage(
    "playState",
    defaultPlayState,
  );
  const [playState, setPlayState] = useState(playStateStorage);
  const [openModal, setOpenModal] = useState<ModalType | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapRef = useRef(null);

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
      !!playState.weapon &&
      (lowestWeapon === undefined || cardValue < lowestWeapon)
    );
  }

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
    playState.gameState === GameStates.InProgress &&
    getValidRoomCards(playState.roomCards).length === 4 &&
    !ranLastRoom;

  // ===================================
  // Start/stop win/lose logic
  // ===================================

  function gameReset() {
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

  function gameWin() {
    setOpenModal(Modals.Won);

    setPlayState((prev) => ({
      ...prev,
      gameState: GameStates.Won,
      score: playState.health + playState.bonusScore,
    }));
  }

  useEffect(() => {
    animationCleanup();

    if (playState.gameState === undefined) {
      // Initial game
      gameReset();
    } else if (
      playState.gameState === GameStates.InProgress &&
      playState.health <= 0
    ) {
      // Trigger lost
      gameLose();
    } else if (playState.gameState === GameStates.InProgress) {
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

  async function doHeal(card: string) {
    setIsAnimating(true);

    await animateCard(card, "potion");

    const { cardValue } = parseCard(card);

    let health = playState.health + cardValue;
    if (health > maxHealth) health = maxHealth;

    // Bonus score if applicable
    let bonusScore = 0;

    if (
      playState.drawDeck.length === 0 &&
      playState.roomCards.length === 0 &&
      playState.health === maxHealth
    ) {
      bonusScore = cardValue;
    }

    setPlayState((prev) => ({
      ...prev,
      health,
      usedPotionInRoom: true,
      bonusScore: bonusScore,
    }));

    discardFromRoom(card);

    setIsAnimating(false);
  }

  async function doEquip(card: string) {
    setIsAnimating(true);

    await animateCard(card, "weapon-equip");

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

    setIsAnimating(false);
  }

  async function doFightWeapon(card: string) {
    setIsAnimating(true);

    await animateCard(card, "weapon-monster");

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

    setIsAnimating(false);
  }

  async function doFightBarefist(card: string) {
    setIsAnimating(true);

    await animateCard(card, "barefist");

    const { cardValue } = parseCard(card);

    let health = playState.health - cardValue;
    if (health < 0) health = 0;

    setPlayState((prev) => ({
      ...prev,
      health,
    }));

    discardFromRoom(card);

    setIsAnimating(false);
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
      isRunning: true,
    }));
  }

  return (
    <PlayContext.Provider value={{ state: playState, setPlayState, gameReset }}>
      <ModalContext.Provider value={{ openModal, setOpenModal }}>
        <div
          ref={wrapRef}
          className={`wrap game-state--${playState.gameState?.toLowerCase() ?? "na"}`}
        >
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

          <div className="main">
            <ImagePreloader />

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
              <div
                className={clsx(
                  "health-bar",
                  playState.health / maxHealth < 0.5
                    ? playState.health / maxHealth < 0.25
                      ? "health-bar--red"
                      : "health-bar--orange"
                    : "health-bar--green",
                )}
              >
                <div className="health-bar__icon">{<HeartIcon />}</div>
                <div
                  className="health-bar__progress"
                  style={{
                    width: `${((playState.health + 3) / (maxHealth + 3)) * 100}%`,
                  }}
                />
                <span className="health-bar__text">
                  <span>
                    {playState.health}

                    <span className="pale"> / {maxHealth ?? "--"}</span>
                  </span>
                </span>
              </div>

              <div className="deck-and-weapons">
                <div className="weapons">
                  <div className="weapons__weapon">
                    {!playState.weapon && <SwordIcon />}

                    <Card card={playState.weapon} />
                  </div>

                  <div className="weapons__separator" />

                  <div className="weapons__cards">
                    {playState.weaponCards.map((card, index) => {
                      return <Card key={"weapon-card" + index} card={card} />;
                    })}

                    <DragonIcon />
                  </div>
                </div>

                <div
                  className={clsx(
                    "draw-deck",
                    playState.drawDeck.length === 0 && "draw-deck--empty",
                  )}
                  style={{ transform: "translate(4px, 4px)" }}
                  onClick={() => {
                    setOpenModal(Modals.Deck);
                  }}
                >
                  {Array.from(
                    { length: Math.ceil(playState.drawDeck.length / 8) },
                    (num, index) => (
                      <div
                        key={index + "cardwrap"}
                        className="card-wrap"
                        style={{
                          zIndex: index,
                          marginTop: `-${index * 2}px`,
                          marginLeft: `-${index * 2}px`,
                        }}
                      >
                        {index ===
                          Math.ceil(playState.drawDeck.length / 8) - 1 && (
                          <div className="draw-deck__text">
                            <span className="draw-deck__text__count">
                              {playState.drawDeck.length}
                            </span>

                            {/* <span className="draw-deck__text__peek">Peek</span> */}
                          </div>
                        )}
                        <Card key={index} card="back" />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="rooms">
                <button className="reset-btn" type="button" onClick={gameReset}>
                  Reset
                </button>

                <div className="rooms__center">
                  <div className="rooms__center__count">
                    <span className="rooms__center__count__current">
                      {playState.currentRoom ?? 1}
                    </span>
                    <span className="rooms__center__count__total">
                      {" "}
                      / {roomsTotal}
                    </span>
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

              <div className="room-and-actions">
                <div className="room-cards">
                  {playState.roomCards.map((card, index) => {
                    return <Card key={"card" + index} card={card} />;
                  })}
                </div>

                <div className="actions">
                  {playState.gameState === GameStates.InProgress &&
                    playState.roomCards.map((card, index) => {
                      const { cardType, cardValue } = parseCard(card);

                      return (
                        <div
                          key={"action" + index}
                          className="actions__buttons"
                        >
                          {card && (
                            <>
                              {cardType === CardTypes.Potion && (
                                <ActionButton
                                  type="heal"
                                  extraClasses={
                                    playState.usedPotionInRoom
                                      ? ["action-btn--heal-no-effect"]
                                      : undefined
                                  }
                                  value={`+${playState.usedPotionInRoom ? 0 : cardValue}`}
                                  onClick={() => doHeal(card)}
                                  isAnimating={isAnimating}
                                />
                              )}

                              {cardType === CardTypes.Weapon && (
                                <ActionButton
                                  type="equip"
                                  onClick={() => doEquip(card)}
                                  isAnimating={isAnimating}
                                />
                              )}

                              {cardType === CardTypes.Monster && (
                                <>
                                  <ActionButton
                                    type="fight-weapon"
                                    value={
                                      canUseWeapon(cardValue)
                                        ? `-${getDamageValue(card)}`
                                        : "--"
                                    }
                                    onClick={() => doFightWeapon(card)}
                                    isAvailable={canUseWeapon(cardValue)}
                                    isAnimating={isAnimating}
                                    showSkull={
                                      canUseWeapon(cardValue) &&
                                      getDamageValue(card) >= playState.health
                                    }
                                  />

                                  <ActionButton
                                    type="fight-barefist"
                                    value={`-${cardValue}`}
                                    onClick={() => doFightBarefist(card)}
                                    isAnimating={isAnimating}
                                    showSkull={cardValue >= playState.health}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalEmbeds />
      </ModalContext.Provider>
    </PlayContext.Provider>
  );
}

export default App;
