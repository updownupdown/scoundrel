import { maxHealth } from "./constants";

export type PlayState = {
  drawDeck: string[];
  discardDeck: string[];
  currentRoom?: number;
  roomCards: (string | undefined)[];
  ranRooms: number[];
  health: number;
  weapon?: string;
  weaponCards: string[];
  gameState?: GameState;
  score: number;
  bonusScore: number;
  isRunning: boolean;
  usedPotionInRoom: boolean;
};

export type Stats = {
  gamesLost: number;
  gamesWon: number;
  gamesReset: number;
};

export const defaultStats = {
  gamesLost: 0,
  gamesWon: 0,
  gamesReset: 0,
};

export const GameStates = {
  Stopped: "Stopped",
  InProgress: "In Progress",
  Lost: "Lost",
  Won: "Won",
} as const;

export type GameState = (typeof GameStates)[keyof typeof GameStates];

export const defaultPlayState: PlayState = {
  drawDeck: [],
  discardDeck: [],
  currentRoom: undefined,
  roomCards: [],
  ranRooms: [],
  weapon: undefined,
  weaponCards: [],
  health: maxHealth,
  gameState: undefined,
  score: 0,
  bonusScore: 0,
  isRunning: false,
  usedPotionInRoom: false,
};

export const CardTypes = {
  Potion: "Potion",
  Weapon: "Weapon",
  Monster: "Monster",
} as const;

export type CardType = (typeof CardTypes)[keyof typeof CardTypes];
