import clsx from "clsx";
import type React from "react";

interface CardProps {
  card: string | undefined;
  style?: React.CSSProperties;
}

export const Card = ({ card, style }: CardProps) => {
  return (
    <div
      className={clsx("card", !card && "card--empty")}
      style={style ?? undefined}
    >
      {card && <img src={`./cards/${card}.svg`} />}
    </div>
  );
};
