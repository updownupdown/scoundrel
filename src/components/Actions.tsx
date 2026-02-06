import clsx from "clsx";
import "./HealthBar.scss";
import {
  CardTypes,
  defaultPlayState,
  GameStates,
  type PlayState,
} from "../utils/types";
import { maxHealth } from "../utils/constants";
import { HeartIcon } from "./icons/Heart";
import { ActionButton } from "./ActionButton";
import { parseCard } from "../utils/utils";
import { animateCard } from "../utils/animations";
import type { Dispatch, SetStateAction } from "react";

interface HealthBarProps {
  playState: PlayState;
  setPlayState: Dispatch<SetStateAction<PlayState>>;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export const Actions = ({
  playState,
  setPlayState,
  isAnimating,
  setIsAnimating,
}: HealthBarProps) => {
  // Info
  const lowestWeaponCard = () => {
    const lastWeaponCard =
      playState.weaponCards?.[playState.weaponCards.length - 1];
    if (!lastWeaponCard) return undefined;
    const { cardValue } = parseCard(lastWeaponCard);
    return cardValue;
  };

  const canUseWeapon = (cardValue: number) => {
    const lowestWeapon = lowestWeaponCard();
    return (
      !!playState.weapon &&
      (lowestWeapon === undefined || cardValue < lowestWeapon)
    );
  };

  // Data actions
  function getDamageValue(card: string) {
    const { cardValue: monsterValue } = parseCard(card);
    const { cardValue: weaponValue } = parseCard(playState.weapon);
    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    return damage;
  }

  // Heal
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
      // Discard from room
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
      discardDeck: [...playState.discardDeck, card],
    }));

    setIsAnimating(false);
  }

  // Equip Weapon
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
      // Remove card from room
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
    }));

    setIsAnimating(false);
  }

  // Fight with weapon
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

  // Fight barefisted
  async function doFightBarefist(card: string) {
    setIsAnimating(true);

    await animateCard(card, "barefist");

    const { cardValue } = parseCard(card);

    let health = playState.health - cardValue;
    if (health < 0) health = 0;

    setPlayState((prev) => ({
      ...prev,
      health,
      // Discard from room
      roomCards: playState.roomCards.map((c) => (c === card ? undefined : c)),
      discardDeck: [...playState.discardDeck, card],
    }));

    setIsAnimating(false);
  }

  return (
    <div className="actions">
      {playState.gameState === GameStates.InProgress &&
        playState.roomCards.map((card, index) => {
          const { cardType, cardValue } = parseCard(card);

          return (
            <div key={"action" + index} className="actions__buttons">
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
  );
};
