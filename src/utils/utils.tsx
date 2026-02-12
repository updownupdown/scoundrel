import { allCards, emptyCardSymbol, maxHealth } from "./constants";
import { CardTypes, type CardType } from "./types";

export function arrayShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getHighestOfType(cards: string[], type: CardType) {
  let highest: {
    highestCard: string | undefined;
    highestValue: number | undefined;
  } = { highestCard: undefined, highestValue: undefined };

  for (let i = 0; i < cards.length; i++) {
    const { cardValue, cardType } = parseCard(cards[i]);

    if (
      cardType === type &&
      (!highest.highestValue || cardValue > highest.highestValue)
    ) {
      highest = {
        highestCard: cards[i],
        highestValue: cardValue,
      };
    }
  }

  return highest;
}

function healthAfterBattle(
  cards: string[],
  health: number,
  ignoreMonster: string | undefined,
) {
  const { highestCard: highestPotion } = getHighestOfType(
    cards,
    CardTypes.Potion,
  );

  for (let i = 0; i < cards.length; i++) {
    const { cardValue, cardType } = parseCard(cards[i]);

    if (cardType === "Monster" && cards[i] !== ignoreMonster) {
      health -= cardValue;
    } else if (cardType === "Potion" && cards[i] === highestPotion) {
      health += cardValue;
    }
  }

  return Math.min(health, maxHealth);
}

function dungeonHasFalseStart(cards: string[]) {
  const minHealthAcceptable = 2;
  let isFalseStart = false;
  const firstSeven = cards.slice(0, 7);
  const firstFour = cards.slice(0, 4);
  const nextThree = cards.slice(4, 7);

  const { highestCard: highestMonsterFirstSeven } = getHighestOfType(
    firstSeven,
    CardTypes.Monster,
  );

  let health = maxHealth;

  health = healthAfterBattle(firstFour, health, highestMonsterFirstSeven);
  if (health <= minHealthAcceptable) isFalseStart = true;

  health = healthAfterBattle(nextThree, health, highestMonsterFirstSeven);
  if (health <= minHealthAcceptable) isFalseStart = true;

  return isFalseStart;
}

export function getSafeShuffledDeck() {
  let deck = arrayShuffle(allCards);
  let shuffleCount = 1;

  while (dungeonHasFalseStart(deck) && shuffleCount < 20) {
    shuffleCount += 1;
    deck = arrayShuffle(allCards);
  }

  return deck;
}

export function getValidRoomCards(roomCards: string[]): string[] {
  return roomCards.filter((card) => {
    return card !== emptyCardSymbol;
  });
}

export function parseCard(card: string): {
  cardType: CardType;
  cardValue: number;
} {
  const lastChar = card.slice(-1);
  let cardType: CardType | undefined;

  if (lastChar === "D") {
    cardType = "Weapon";
  } else if (lastChar === "C" || lastChar === "S") {
    cardType = "Monster";
  } else {
    cardType = "Potion";
  }

  return {
    cardType,
    cardValue: Number(card?.slice(0, -1)),
  };
}

export function newAvg(
  currentAverage: number | undefined,
  currentCount: number | undefined,
  newValue: number,
) {
  if (!currentAverage || !currentCount) return newValue;
  return (currentAverage * currentCount + newValue) / (currentCount + 1);
}
