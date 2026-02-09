import "./HealthBar.scss";
import {
  CardTypes,
  GameStates,
  ItemTypes,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import {
  emptyCardSymbol,
  maxCardValue,
  maxHealth,
} from "../../utils/constants";
import { ActionButton } from "./ActionButton";
import { parseCard } from "../../utils/utils";
import { animateCard } from "../../utils/animations";
import type { Dispatch, SetStateAction } from "react";

interface HealthBarProps {
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export const Actions = ({
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
  isAnimating,
  setIsAnimating,
}: HealthBarProps) => {
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

  // Heal
  async function doHeal(card: string) {
    setIsAnimating(true);

    await animateCard(card, "potion");

    const { cardValue } = parseCard(card);

    let health = dungeonState.health + cardValue;
    if (health > maxHealth) health = maxHealth;

    // Bonus score if applicable
    let bonusScore = 0;

    if (
      dungeonState.drawDeck.length === 0 &&
      dungeonState.roomCards.length === 0 &&
      dungeonState.health === maxHealth
    ) {
      bonusScore = cardValue;
    }

    setDungeonState((prev) => ({
      ...prev,
      health,
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

    await animateCard(card, "weapon-equip");

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
    setIsAnimating(true);

    await animateCard(card, "weapon-monster");

    const { cardValue: monsterValue } = parseCard(card);

    if (!dungeonState.weapon) return;
    const { cardValue: weaponValue } = parseCard(dungeonState.weapon);

    let damage = monsterValue - weaponValue;
    if (damage < 0) damage = 0;

    let health = dungeonState.health - damage;
    if (health < 0) health = 0;

    setDungeonState((prev) => ({
      ...prev,
      health,
      roomCards: dungeonState.roomCards.map((c) =>
        c === card ? emptyCardSymbol : c,
      ),
      weaponCards: [...dungeonState.weaponCards, card],
    }));

    // Get coin for slaying a dragon
    if (monsterValue === maxCardValue) {
      setPlayerState((prev) => ({
        ...prev,
        inventoryPack: {
          ...playerState.inventoryPack,
          [ItemTypes.Coin]: playerState.inventoryPack[ItemTypes.Coin] + 1,
        },
      }));
    }

    setIsAnimating(false);
  }

  // Fight barefisted
  async function doFightBarefist(card: string) {
    setIsAnimating(true);

    await animateCard(card, "barefist");

    const { cardValue } = parseCard(card);

    let health = dungeonState.health - cardValue;
    if (health < 0) health = 0;

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

  return (
    <div className="actions">
      {playerState.gameState === GameStates.InProgress &&
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
                        dungeonState.usedPotionInRoom
                          ? ["action-btn--heal-no-effect"]
                          : undefined
                      }
                      value={`+${dungeonState.usedPotionInRoom ? 0 : cardValue}`}
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
                          getDamageValue(card) >= dungeonState.health
                        }
                      />

                      <ActionButton
                        type="fight-barefist"
                        value={`-${cardValue}`}
                        onClick={() => doFightBarefist(card)}
                        isAnimating={isAnimating}
                        showSkull={cardValue >= dungeonState.health}
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
