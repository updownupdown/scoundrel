import React from "react";
import "./DeckModal.scss";
import clsx from "clsx";
import { Modal } from "./Modal";
import { allCards } from "../../utils/constants";
import { Card } from "../Card";

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawDeck: string[];
}

export const DeckModal = ({
  isOpen,
  onClose,
  drawDeck: cards,
}: DeckModalProps) => {
  const suits = ["S", "C", "D", "H"];
  const nums = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  return (
    <Modal title="Draw Deck" isOpen={isOpen} onClose={onClose}>
      <div className="peek-deck">
        {suits.map((suit) => {
          return (
            <div key={suit} className="peek-deck__suit">
              {nums.map((num, index) => {
                const cardName = num + suit;
                const cardPossible = allCards.includes(cardName);

                return (
                  <div
                    key={num + suit}
                    className={clsx(
                      "deck-card",
                      cards.includes(num + suit)
                        ? "deck-card--on"
                        : "deck-card--off",
                      cardPossible
                        ? "desk-card--possible"
                        : "deck-card--impossible",
                    )}
                    style={{ zIndex: index }}
                  >
                    <Card card={num + suit} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
