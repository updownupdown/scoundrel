import React from "react";
import { Modal } from "./Modal";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal = ({ isOpen, onClose }: MenuModalProps) => {
  return (
    <Modal title="Menu" isOpen={isOpen} onClose={onClose}>
      <h2>How to play</h2>
      <p>
        Scoundrel is a single-player dungeon crawler card game. A standard deck
        of cards is used, but without the red face cards, red aces, or jokers.
        You must survive all the dungeon rooms before your health, which starts
        at 20, runs out.
      </p>

      <h3>Rooms</h3>

      <p>
        Each room has 4 cards. You can choose to tackle a room, or run away from
        it. You cannot run from two rooms in a row. To tackle a room, you must
        interact with 3 of the 4 cards in that room. The remaining card will be
        found in the next room.
      </p>

      <h3>Card Types</h3>
      <ul>
        <li>
          <b>Diamonds (weapons):</b> A weapon allows you to fight a monster
          while incurring less damage, equal to the value of that card. You can
          equip one weapon at a time. Each time you fight a monster with a
          weapon, the monster card is stacked next to that weapons, and you
          cannot use that weapon with a card of equal or higher value. Equipping
          another weapon will clear the weapon stack.
        </li>
        <li>
          <b>Hearts (portions):</b> Potions restores health, upo to a maximum of
          20. You can use more than one potion per room, but subsequent potions
          lose their healing effect.
        </li>
        <li>
          <b>Clubs/spades (monsters):</b> You can fight a weapon barefisted
          (losing health equal to that card's value), or with your equipped
          weapon (as per the above rules). Note that aces are worth 14.
        </li>
      </ul>

      <h3>Scoring</h3>
      <p>
        You win by making it through every card/room. You lose by reaching a
        health of 0.
      </p>
      <p>
        Your <b>losing score</b> is equal to the sum of the values of any
        undefeated monsters (which will always be a negative value.
      </p>
      <p>
        Your <b>winning score</b> is equal to your remaining health. If your
        remaining health is 20, and the last card played is a potion, your score
        is 20 plus the value of that potion card.
      </p>

      <h3>Credits</h3>
      <p>Developed by James Carmichael.</p>
      <p>Original game by Zach Gage and Kurt Bieg.</p>

      <p>
        <a href="https://scoundrel-vanilla.netlify.app/" target="_blank">
          Inspired by this implementation.
        </a>
      </p>
      <p>
        <a href="https://github.com/updownupdown/scoundrel" target="_blank">
          View source code on GitHub
        </a>
      </p>
    </Modal>
  );
};
