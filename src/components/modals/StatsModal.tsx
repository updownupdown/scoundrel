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

  function getPerc(num: number) {
    const totalGames = stats.gamesWon + stats.gamesLost + stats.gamesReset;
    if (totalGames === 0) return "0%";
    return `${Math.round((num / totalGames) * 100)}%`;
  }

  return (
    <Modal title="Stats" isOpen={isOpen} onClose={onClose}>
      <div className="stats">
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

        <div className="stats__general">
          <table>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>
                  With
                  <br />
                  resets
                </th>
                <th>
                  Without
                  <br />
                  resets
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Average last room reached</td>
                <td>
                  {stats.avgLastRoomWithResets
                    ? Math.round(stats.avgLastRoomWithResets * 10) / 10
                    : "N/A"}
                </td>
                <td>
                  {stats.avgLastRoomWithoutResets
                    ? Math.round(stats.avgLastRoomWithoutResets * 10) / 10
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Total games played</td>
                <td>{stats.gamesWon + stats.gamesLost + stats.gamesReset}</td>
                <td>{stats.gamesWon + stats.gamesLost}</td>
              </tr>
            </tbody>
          </table>
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
