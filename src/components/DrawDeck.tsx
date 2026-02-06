import clsx from "clsx";
import "./HealthBar.scss";
import type { PlayState } from "../utils/types";
import { maxHealth } from "../utils/constants";
import { HeartIcon } from "./icons/Heart";
import "./DrawDeck.scss";
import { Modals, type ModalType } from "./modals/ModalEmbeds";
import { Card } from "./Card";

interface DrawDeckProps {
  playState: PlayState;
  setOpenModal: (modal: ModalType | undefined) => void;
}

export const DrawDeck = ({ playState, setOpenModal }: DrawDeckProps) => {
  return (
    <div
      className={clsx(
        "draw-deck",
        playState.drawDeck.length === 0 && "draw-deck--empty",
      )}
      style={{ transform: "translate(4px, 4px)" }}
      onClick={() => {
        setOpenModal(Modals.Deck);
      }}
    >
      {Array.from(
        { length: Math.ceil(playState.drawDeck.length / 8) },
        (num, index) => (
          <div
            key={index + "cardwrap"}
            className="card-wrap"
            style={{
              zIndex: index,
              marginTop: `-${index * 2}px`,
              marginLeft: `-${index * 2}px`,
            }}
          >
            {index === Math.ceil(playState.drawDeck.length / 8) - 1 && (
              <div className="draw-deck__text">
                <span className="draw-deck__text__count">
                  {playState.drawDeck.length}
                </span>

                {/* <span className="draw-deck__text__peek">Peek</span> */}
              </div>
            )}
            <Card key={index} card="back" />
          </div>
        ),
      )}
    </div>
  );
};
