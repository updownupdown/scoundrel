import { useEffect, useState } from "react";

export function useCardSvg(card: string | undefined) {
  const [svgContent, setSvgContent] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    async function fetchSvg() {
      try {
        const response = await fetch(`/src/assets/cards/${card}.svg`);
        if (!response.ok) throw new Error("SVG not found");
        const text = await response.text();
        if (isMounted) setSvgContent(text);
      } catch (e) {
        if (isMounted) setSvgContent(undefined);
      }
    }
    fetchSvg();

    return () => {
      isMounted = false;
    };
  }, [card]);

  return svgContent;
}

interface CardProps {
  card: string | undefined;
}

export const Card = ({ card }: CardProps) => {
  const svg = useCardSvg(card);

  if (!card || !svg) {
    return <div className="card card--empty" />;
  }

  return <div className="card" dangerouslySetInnerHTML={{ __html: svg }} />;
};
