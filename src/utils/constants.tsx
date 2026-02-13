export const currentVersion = 2;

export const maxHealth = 20;
export const maxCardValue = 14;

export const emptyCardSymbol = "-";

export const coinsValues = {
  killAceWithWeapon: 2,
  killAceWithFist: 1,
} as const;

export const allCards = [
  // Clubs - monsters
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "10C",
  "11C",
  "12C",
  "13C",
  "14C",

  // Spades - monsters
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "10S",
  "11S",
  "12S",
  "13S",
  "14S",

  // Hearts - potions
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "10H",

  // Diamonds - weapons
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "10D",
];

export const roomsTotal = Math.ceil(allCards.length / 3);
