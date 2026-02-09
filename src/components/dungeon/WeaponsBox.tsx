import clsx from "clsx";
import "./HealthBar.scss";
import type { DungeonState } from "../../utils/types";
import { SwordIcon } from "../icons/Sword";
import { DragonIcon } from "../icons/Dragon";
import "./WeaponsBox.scss";
import { Card } from "../misc/Card";

interface WeaponsBoxProps {
  dungeonState: DungeonState;
}

export const WeaponsBox = ({ dungeonState }: WeaponsBoxProps) => {
  return (
    <div className="weapons">
      <div className="weapons__weapon">
        {!dungeonState.weapon && <SwordIcon />}

        <Card card={dungeonState.weapon} />
      </div>

      <div className="weapons__separator" />

      <div className="weapons__cards">
        {dungeonState.weaponCards.map((card, index) => {
          return <Card key={"weapon-card" + index} card={card} />;
        })}

        <DragonIcon />
      </div>
    </div>
  );
};
