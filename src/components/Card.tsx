interface CardProps {
  card: string | undefined;
}

export const Card = ({ card }: CardProps) => {
  if (card) {
    return (
      <div className="card">
        <img src={`./cards/${card}.svg`} />
      </div>
    );
  } else {
    return <div className="card card--empty" />;
  }
};
