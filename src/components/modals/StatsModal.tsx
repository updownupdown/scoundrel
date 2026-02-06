import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Modal } from "./Modal";
import { defaultStats, type Stats } from "../../utils/types";
import clsx from "clsx";
import "./StatsModal.scss";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
  setStats: Dispatch<SetStateAction<Stats>>;
}

const resetPressRequired = 4;

export const StatsModal = ({
  isOpen,
  onClose,
  stats,
  setStats,
}: StatsModalProps) => {
  const [resetPressesLeft, setResetPressesLeft] = useState(resetPressRequired);

  const totalGames = stats.gamesWon + stats.gamesLost + stats.gamesReset;

  function getPerc(num: number) {
    if (totalGames === 0) return "0%";
    return `${Math.round((num / totalGames) * 100)}%`;
  }

  return (
    <Modal title="Stats" isOpen={isOpen} onClose={onClose}>
      <div className="stats">
        <div className="stats__total-games">
          Games played: <b>{totalGames}</b>
        </div>

        <div className="stats-bar">
          <div
            className="stats-bar__bar stats-bar__bar--green"
            style={{ width: getPerc(stats.gamesWon) }}
          />
          <div
            className="stats-bar__bar stats-bar__bar--red"
            style={{ width: getPerc(stats.gamesLost) }}
          />
          <div
            className="stats-bar__bar stats-bar__bar--orange"
            style={{ width: getPerc(stats.gamesReset) }}
          />
        </div>

        <div className="stats__games">
          <span className="stats__games__cat color-green">
            <span>Won: {stats.gamesWon}</span>
            <span>{getPerc(stats.gamesWon)}</span>
          </span>
          <span className="stats__games__cat color-red">
            <span>Lost: {stats.gamesLost}</span>
            <span>{getPerc(stats.gamesLost)}</span>
          </span>
          <span className="stats__games__cat color-orange">
            <span>Reset: {stats.gamesReset}</span>
            <span>{getPerc(stats.gamesReset)}</span>
          </span>
        </div>
      </div>

      <button
        className={clsx(
          "plain-btn",
          resetPressesLeft < resetPressRequired && "red-btn",
        )}
        onClick={() => {
          if (resetPressesLeft > 1) {
            setResetPressesLeft(resetPressesLeft - 1);
          } else {
            setResetPressesLeft(resetPressRequired);
            setStats(defaultStats);
          }
        }}
      >
        {resetPressesLeft < resetPressRequired
          ? `Press ${resetPressesLeft} more time${resetPressesLeft > 1 ? "s" : ""} to reset...`
          : "Reset stats"}
      </button>
    </Modal>
  );
};
