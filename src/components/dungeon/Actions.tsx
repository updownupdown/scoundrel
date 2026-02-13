import "./HealthBar.scss";
import {
  CardTypes,
  GameModes,
  GameStates,
  ItemTypes,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import {
  coinsValues,
  emptyCardSymbol,
  maxCardValue,
  maxHealth,
} from "../../utils/constants";
import { ActionButton } from "./ActionButton";
import { parseCard } from "../../utils/utils";
import { type Dispatch, type SetStateAction } from "react";
import { actionAnimationDurationSec, useAnimations } from "../misc/Animations";

interface HealthBarProps {
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Actions = ({
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
  isAnimating,
  setIsAnimating,
}: HealthBarProps) => {
  const { animationsWrap, triggerAnimation } = useAnimations();

  // Info
  const lowestWeaponCard = () => {
    const lastWeaponCard =
      dungeonState.weaponCards?.[dungeonState.weaponCards.length - 1];
    if (!lastWeaponCard) return undefined;
    const { cardValue } = parseCard(lastWeaponCard);
    return cardValue;
  };

  const canUseWeapon = (cardValue: number) => {
    const lowestWeapon = lowestWeaponCard();
    return (
      !!dungeonState.weapon &&
      (lowestWeapon === undefined || cardValue < lowestWeapon)
    );
  };

  // Data actions
  function getDamageValue(card: string) {
    if (card === emptyCardSymbol || !dungeonState.weapon) return 0;

    const { cardValue: monsterValue } = parseCard(card);
    const { cardValue: weaponValue } = parseCard(dungeonState.weapon);

    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    return damage;
  }

  // Trigger coins
  function triggerCoins(coinsNum: number) {
    triggerAnimation({
      type: "coins",
      qty: coinsNum,
      targetClass: "backpack-btn",
      startOffset: { x: 0, y: 0 },
      endOffset: { x: 0, y: -70 },
      duration: 2,
    });

    setPlayerState((prev) => ({
      ...prev,
      inventoryPack: {
        ...playerState.inventoryPack,
        [ItemTypes.Coin]: playerState.inventoryPack[ItemTypes.Coin] + coinsNum,
      },
    }));
  }

  function triggerRat(cardValue: number) {
    const maxCardForRat = 10;
    if (cardValue > maxCardForRat) return;

    const probabilityOfRat =
      (Math.abs(cardValue - maxCardForRat - 1) / maxCardForRat) * 0.5;
    const isSuccess = Math.random() < probabilityOfRat;

    if (isSuccess) {
      triggerAnimation({
        type: "rat",
        qty: 1,
        targetClass: "backpack-btn",
        startOffset: { x: 0, y: 0 },
        endOffset: { x: 0, y: -70 },
        duration: 2,
      });

      setPlayerState((prev) => ({
        ...prev,
        inventoryPack: {
          ...playerState.inventoryPack,
          [ItemTypes.Rat]: playerState.inventoryPack[ItemTypes.Rat] + 1,
        },
      }));
    }
  }

  // Heal
  const doublePotionsCanHeal =
    playerState.gameMode === GameModes.Mercy || !dungeonState.usedPotionInRoom;

  async function doHeal(card: string) {
    const { cardValue } = parseCard(card);

    let newHealth = dungeonState.health;
    let healValue = 0;
    let bonusScore = 0;

    if (doublePotionsCanHeal) {
      healValue = Math.min(maxHealth - dungeonState.health, cardValue);
      newHealth = dungeonState.health + healValue;

      if (
        dungeonState.drawDeck.length === 0 &&
        dungeonState.roomCards.length === 0 &&
        dungeonState.health === maxHealth
      ) {
        bonusScore = cardValue;
      }
    }

    setIsAnimating(true);

    triggerAnimation({
      type: "card",
      card: card,
      targetType: "potion",
      duration: actionAnimationDurationSec,
    });

    await delay(actionAnimationDurationSec * 1000);

    setDungeonState((prev) => ({
      ...prev,
      health: newHealth,
      usedPotionInRoom: true,
      bonusScore: bonusScore,
      // Discard from room
      roomCards: dungeonState.roomCards.map((c) =>
        c === card ? emptyCardSymbol : c,
      ),
      discardDeck: [...dungeonState.discardDeck, card],
    }));

    setIsAnimating(false);
  }

  // Equip Weapon
  async function doEquip(card: string) {
    setIsAnimating(true);

    triggerAnimation({
      type: "card",
      card: card,
      targetType: "weapon-equip",
      duration: actionAnimationDurationSec,
    });

    await delay(actionAnimationDurationSec * 1000);

    setDungeonState((prev) => ({
      ...prev,
      // Discard previous weapons and weapon cards
      discardDeck: [
        ...dungeonState.discardDeck,
        ...(dungeonState.weapon !== undefined ? [dungeonState.weapon] : []),
        ...(dungeonState.weaponCards !== undefined
          ? dungeonState.weaponCards
          : []),
      ],
      // Equip current
      weapon: card,
      weaponCards: [],
      // Remove card from room
      roomCards: dungeonState.roomCards.map((c) =>
        c === card ? emptyCardSymbol : c,
      ),
    }));

    setIsAnimating(false);
  }

  // Fight with weapon
  async function doFightWeapon(card: string) {
    const { cardValue } = parseCard(card);

    if (!dungeonState.weapon) return;
    const { cardValue: weaponValue } = parseCard(dungeonState.weapon);

    let damage = cardValue - weaponValue;
    if (damage < 0) damage = 0;

    let health = dungeonState.health - damage;
    if (health < 0) health = 0;

    setIsAnimating(true);

    // Get coin for dragons
    if (playerState.gameMode === GameModes.Rogue) {
      if (cardValue === maxCardValue) {
        triggerCoins(coinsValues.killAceWithWeapon);
      }

      triggerRat(cardValue);
    }

    triggerAnimation({
      type: "card",
      card: card,
      targetType: "weapon-monster",
      duration: actionAnimationDurationSec,
    });

    await delay(actionAnimationDurationSec * 1000);

    setDungeonState((prev) => ({
      ...prev,
      health,
      roomCards: dungeonState.roomCards.map((c) =>
        c === card ? emptyCardSymbol : c,
      ),
      weaponCards: [...dungeonState.weaponCards, card],
    }));

    setIsAnimating(false);
  }

  // Fight barefisted
  async function doFightBarefist(card: string) {
    const { cardValue } = parseCard(card);

    let health = dungeonState.health - cardValue;
    if (health < 0) health = 0;

    setIsAnimating(true);

    // Get coin for dragons
    if (playerState.gameMode === GameModes.Rogue) {
      if (cardValue === maxCardValue) {
        triggerCoins(coinsValues.killAceWithFist);
      }

      triggerRat(cardValue);
    }

    triggerAnimation({
      type: "card",
      card: card,
      targetType: "barefist",
      duration: actionAnimationDurationSec,
    });

    await delay(actionAnimationDurationSec * 1000);

    setDungeonState((prev) => ({
      ...prev,
      health,
      // Discard from room
      roomCards: dungeonState.roomCards.map((c) =>
        c === card ? emptyCardSymbol : c,
      ),
      discardDeck: [...dungeonState.discardDeck, card],
    }));

    setIsAnimating(false);
  }

  const showActions =
    playerState.gameState === GameStates.InProgress ||
    playerState.gameState === GameStates.Paused;
  const isPaused = playerState.gameState === GameStates.Paused;

  return (
    <div className="actions">
      {animationsWrap}

      {showActions &&
        dungeonState.roomCards.map((card, index) => {
          const { cardType, cardValue } = parseCard(card);

          return (
            <div key={"action" + index} className="actions__buttons">
              {card !== emptyCardSymbol && (
                <>
                  {cardType === CardTypes.Potion && (
                    <ActionButton
                      type="heal"
                      extraClasses={
                        !doublePotionsCanHeal
                          ? ["action-btn--heal-no-effect"]
                          : undefined
                      }
                      value={`+${doublePotionsCanHeal ? cardValue : 0}`}
                      onClick={() => doHeal(card)}
                      isAnimating={isAnimating}
                      isAvailable={!isPaused}
                    />
                  )}

                  {cardType === CardTypes.Weapon && (
                    <ActionButton
                      type="equip"
                      onClick={() => doEquip(card)}
                      isAnimating={isAnimating}
                      isAvailable={!isPaused}
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
                        isAvailable={canUseWeapon(cardValue) && !isPaused}
                        isAnimating={isAnimating}
                        showSkull={
                          canUseWeapon(cardValue) &&
                          getDamageValue(card) >= dungeonState.health
                        }
                      />

                      <ActionButton
                        type="fight-barefist"
                        value={`-${cardValue}`}
                        onClick={() => doFightBarefist(card)}
                        isAnimating={isAnimating}
                        showSkull={cardValue >= dungeonState.health}
                        isAvailable={!isPaused}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};
