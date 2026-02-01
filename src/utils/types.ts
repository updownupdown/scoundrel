export const CardTypes = {
  Potion: "Potion",
  Weapon: "Weapon",
  Monster: "Monster",
} as const;

export type CardType = (typeof CardTypes)[keyof typeof CardTypes];
