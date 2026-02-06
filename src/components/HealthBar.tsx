import clsx from "clsx";
import "./HealthBar.scss";
import type { PlayState } from "../utils/types";
import { maxHealth } from "../utils/constants";
import { HeartIcon } from "./icons/Heart";

interface HealthBarProps {
  playState: PlayState;
}

export const HealthBar = ({ playState }: HealthBarProps) => {
  return (
    <div
      className={clsx(
        "health-bar",
        playState.health / maxHealth < 0.5
          ? playState.health / maxHealth < 0.25
            ? "health-bar--red"
            : "health-bar--orange"
          : "health-bar--green",
      )}
    >
      <div className="health-bar__icon">{<HeartIcon />}</div>
      <div
        className="health-bar__progress"
        style={{
          width: `${((playState.health + 3) / (maxHealth + 3)) * 100}%`,
        }}
      />
      <span className="health-bar__text">
        <span>
          {playState.health}

          <span className="pale"> / {maxHealth ?? "--"}</span>
        </span>
      </span>
    </div>
  );
};
