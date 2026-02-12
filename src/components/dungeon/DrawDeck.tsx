import clsx from "clsx";
import "./HealthBar.scss";
import {
  GameStates,
  type DungeonState,
  type PlayerState,
} from "../../utils/types";
import { maxHealth } from "../../utils/constants";
import { HeartIcon } from "../icons/Heart";
import "./DrawDeck.scss";
import { Modals, type ModalType } from "../modals/ModalEmbeds";
import { Card } from "../misc/Card";

interface DrawDeckProps {
  playerState: PlayerState;
  dungeonState: DungeonState;
  setOpenModal: (modal: ModalType | undefined) => void;
}

export const DrawDeck = ({
  playerState,
  dungeonState,
  setOpenModal,
}: DrawDeckProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "draw-deck",
        dungeonState.drawDeck.length === 0 && "draw-deck--empty",
      )}
      style={{ transform: "translate(4px, 4px)" }}
      onClick={() => {
        setOpenModal(Modals.Deck);
      }}
      disabled={playerState.gameState === GameStates.Paused}
    >
      {Array.from(
        { length: Math.ceil(dungeonState.drawDeck.length / 8) },
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
            {index === Math.ceil(dungeonState.drawDeck.length / 8) - 1 && (
              <div className="draw-deck__text">
                <span className="draw-deck__text__count">
                  {dungeonState.drawDeck.length}
                </span>

                {/* <span className="draw-deck__text__peek">Peek</span> */}
              </div>
            )}
            <Card key={index} card="back" />
          </div>
        ),
      )}
    </button>
  );
};
