import type { CardType } from "./types";

export function arrayShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getValidRoomCards(roomCards: (string | undefined)[]): string[] {
  return roomCards.filter((card): card is string => card !== undefined);
}

export function parseCard(card?: string): {
  cardType: CardType;
  cardValue: number;
} {
  const lastChar = card?.slice(-1);
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
