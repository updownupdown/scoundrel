import clsx from "clsx";
import "./HealthBar.scss";
import type { DungeonState } from "../../utils/types";
import { maxHealth } from "../../utils/constants";
import { HeartIcon } from "../icons/Heart";

interface HealthBarProps {
  dungeonState: DungeonState;
}

export const HealthBar = ({ dungeonState }: HealthBarProps) => {
  return (
    <div
      className={clsx(
        "health-bar",
        dungeonState.health / maxHealth < 0.5
          ? dungeonState.health / maxHealth < 0.25
            ? "health-bar--red"
            : "health-bar--orange"
          : "health-bar--green",
      )}
    >
      <div className="health-bar__icon">{<HeartIcon />}</div>
      <div
        className="health-bar__playerState"
        style={{
          width: `${((dungeonState.health + 3) / (maxHealth + 3)) * 100}%`,
        }}
      />
      <span className="health-bar__text">
        <span>
          {dungeonState.health}

          <span className="pale"> / {maxHealth ?? "--"}</span>
        </span>
      </span>
    </div>
  );
};
