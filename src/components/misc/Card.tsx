import clsx from "clsx";
import type React from "react";
import "./Card.scss";
import { emptyCardSymbol } from "../../utils/constants";

interface CardProps {
  card: string | undefined;
  style?: React.CSSProperties;
}

export const Card = ({ card, style }: CardProps) => {
  return (
    <div
      className={clsx(
        "card",
        `card--${card}`,
        (!card || card === emptyCardSymbol) && "card--empty",
      )}
      style={style ?? undefined}
    >
      {card && card !== emptyCardSymbol && <img src={`./cards/${card}.svg`} />}
    </div>
  );
};
