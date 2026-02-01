import { useEffect } from "react";
import { allCards } from "./constants";

export const ImagePreloader = () => {
  useEffect(() => {
    allCards.forEach((card) => {
      const img = new Image();
      img.src = `./cards/${card}.svg`;
    });
  }, []);

  return null;
};
