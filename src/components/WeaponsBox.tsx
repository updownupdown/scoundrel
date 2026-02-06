import clsx from "clsx";
import "./HealthBar.scss";
import type { PlayState } from "../utils/types";
import { SwordIcon } from "./icons/Sword";
import { Card } from "./Card";
import { DragonIcon } from "./icons/Dragon";
import "./WeaponsBox.scss";

interface WeaponsBoxProps {
  playState: PlayState;
}

export const WeaponsBox = ({ playState }: WeaponsBoxProps) => {
  return (
    <div className="weapons">
      <div className="weapons__weapon">
        {!playState.weapon && <SwordIcon />}

        <Card card={playState.weapon} />
      </div>

      <div className="weapons__separator" />

      <div className="weapons__cards">
        {playState.weaponCards.map((card, index) => {
          return <Card key={"weapon-card" + index} card={card} />;
        })}

        <DragonIcon />
      </div>
    </div>
  );
};
