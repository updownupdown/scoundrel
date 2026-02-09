import type React from "react";
import { CoinIcon } from "../components/icons/Coin";
import { maxHealth } from "./constants";
import { PotionIcon } from "../components/icons/Potion";
import { HomeIcon } from "../components/icons/Home";
import { ShopIcon } from "../components/icons/Shop";
import { CharacterIcon } from "../components/icons/Character";

export const GameStates = {
  Welcome: "Welcome",
  Home: "Home",
  DungeonEnd: "DungeonEnd",
  InProgress: "In Progress",
} as const;

export type GameState = (typeof GameStates)[keyof typeof GameStates];

export const HomeTabs = {
  Home: "Home",
  Shop: "Shop",
  Character: "Character",
} as const;

export type HomeTab = (typeof HomeTabs)[keyof typeof HomeTabs];

export const HomeTabIcon: Record<HomeTab, React.ComponentType<any>> = {
  [HomeTabs.Home]: HomeIcon,
  [HomeTabs.Shop]: ShopIcon,
  [HomeTabs.Character]: CharacterIcon,
};

export const CardTypes = {
  Potion: "Potion",
  Weapon: "Weapon",
  Monster: "Monster",
} as const;

export type CardType = (typeof CardTypes)[keyof typeof CardTypes];

export const ItemTypes = {
  Coin: "Coin",
  Potion: "Potion",
  // Rat: "Rat",
  // Bomb: "Bomb",
} as const;

export type ItemType = (typeof ItemTypes)[keyof typeof ItemTypes];

export type Inventory = Record<ItemType, number>;

export const ItemCost: Record<ItemType, number | undefined> = {
  [ItemTypes.Coin]: undefined,
  [ItemTypes.Potion]: 5,
  // [ItemTypes.Rat]: 1,
  // [ItemTypes.Bomb]: 20,
};

export const ItemIcon: Record<ItemType, React.ComponentType<any>> = {
  [ItemTypes.Coin]: CoinIcon,
  [ItemTypes.Potion]: PotionIcon,
  // [ItemTypes.Rat]: RatIcon,
  // [ItemTypes.Bomb]: BombIcon,
};

export const defaultInventory: Inventory = {
  [ItemTypes.Coin]: 0,
  [ItemTypes.Potion]: 0,
  // [ItemTypes.Rat]: 0,
  // [ItemTypes.Bomb]: 0,
};

export type DungeonState = {
  drawDeck: string[];
  discardDeck: string[];
  currentRoom: number;
  currentDungeon: number;
  roomCards: string[];
  ranRooms: number[];
  health: number;
  weapon?: string;
  weaponCards: string[];
  score: number;
  bonusScore: number;
  scoreEndless: number;
  isRunning: boolean;
  usedPotionInRoom: boolean;
  foundGold: number;
};

export const defaultDungeonState: DungeonState = {
  drawDeck: [],
  discardDeck: [],
  currentRoom: 0,
  currentDungeon: 1,
  roomCards: [],
  ranRooms: [],
  weapon: undefined,
  weaponCards: [],
  health: maxHealth,
  score: 0,
  bonusScore: 0,
  scoreEndless: 0,
  isRunning: false,
  usedPotionInRoom: false,
  foundGold: 0,
};

export type PlayerState = {
  gameState: GameState;
  gamesLost: number;
  gamesWon: number;
  lastGameWon?: boolean;
  avgLastRoom?: number;
  avgLastRoomAcrossDungeons?: number;
  avgLastDungeon?: number;
  inventoryHome: Inventory;
  inventoryPack: Inventory;
};

export const defaultPlayerState: PlayerState = {
  gameState: GameStates.Welcome,
  gamesLost: 0,
  gamesWon: 0,
  lastGameWon: undefined,
  avgLastRoom: undefined,
  avgLastRoomAcrossDungeons: undefined,
  avgLastDungeon: undefined,
  inventoryHome: defaultInventory,
  inventoryPack: defaultInventory,
};
