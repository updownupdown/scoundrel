import clsx from "clsx";
import { PotionIcon } from "./icons/Potion";
import { SwordIcon } from "./icons/Sword";
import { FistIcon } from "./icons/Fist";
import { EquipIcon } from "./icons/Equip";
import { SkullIcon } from "./icons/Skull";
import "./ActionButton.scss";

interface ActionButtonsProps {
  type: "fight-weapon" | "fight-barefist" | "heal" | "equip";
  value?: string;
  isAvailable?: boolean;
  extraClasses?: string[];
  onClick: () => void;
  isAnimating: boolean;
  showSkull?: boolean;
}

export const ActionButton = ({
  type,
  isAvailable = true,
  value,
  extraClasses,
  onClick,
  isAnimating,
  showSkull,
}: ActionButtonsProps) => {
  return (
    <button
      className={clsx(
        "action-btn",
        (type === "fight-barefist" || type === "fight-weapon") &&
          "action-btn--fight",
        `action-btn--${type}`,
        !isAvailable && "action-btn--na",
        extraClasses && [...extraClasses],
      )}
      onClick={onClick}
      disabled={!isAvailable || isAnimating}
    >
      {type === "heal" && <PotionIcon />}
      {type === "equip" && <EquipIcon />}
      {type === "fight-barefist" && <FistIcon />}
      {type === "fight-weapon" && <SwordIcon />}

      {showSkull && (
        <div className="skull-icon">
          <SkullIcon />
        </div>
      )}

      {value && <span>{value}</span>}
    </button>
  );
};
