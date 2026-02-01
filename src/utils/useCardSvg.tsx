interface CardProps {
  card: string | undefined;
}

export const Card = ({ card }: CardProps) => {
  if (card) {
    return <img className="card" src={`./cards/${card}.svg`} />;
  } else {
    return <div className="card card--empty" />;
  }
};
