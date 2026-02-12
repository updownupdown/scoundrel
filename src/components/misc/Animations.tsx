import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { CoinIcon } from "../icons/Coin";
import "./Animations.scss";

const animationDurationSec = 1.5;

export function getRefElementCenter(
  elementRef: React.RefObject<HTMLDivElement | null>,
) {
  if (elementRef.current) {
    const rect = elementRef.current.getBoundingClientRect(); //
    const centerX = rect.left + rect.width / 2; //
    const centerY = rect.top + rect.height / 2;

    return { x: centerX, y: centerY };
  } else {
    return undefined;
  }
}

export function getCenterByClass(className: string) {
  const cardEl = document.querySelectorAll(`.${className}`);

  if (cardEl[0]) {
    const rect = cardEl[0].getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return { x: centerX, y: centerY };
  } else {
    return undefined;
  }
}

export type AnimationItems = "coins" | "heal" | "damage" | "xp";

type AnimationItemProps = {
  id: number;
  type: AnimationItems;
  qty?: number;
  startPos?: { x: number; y: number };
  targetClass?: string;
};

export const useAnimations = () => {
  const [items, setItems] = useState<AnimationItemProps[]>([]);

  function triggerAnimation({
    type,
    startPos,
    qty,
    targetClass,
  }: {
    type: AnimationItems;
    startPos?: { x: number; y: number };
    qty?: number;
    targetClass?: string;
  }) {
    const id = Date.now();

    const startingPosition = targetClass
      ? getCenterByClass(targetClass)
      : startPos;

    setItems((prev) => [
      ...prev,
      { id, type, qty, startPos: startingPosition },
    ]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, animationDurationSec * 1000);
  }

  return {
    animationsWrap: (
      <div className="animations">
        <AnimatePresence key="anim">
          {items.map((item) => {
            const posAnim = item.startPos
              ? {
                  x: [item.startPos.x, item.startPos.x, item.startPos.x],
                  y: [
                    item.startPos.y + 10,
                    item.startPos.y - 20,
                    item.startPos.y - 50,
                  ],
                }
              : undefined;

            return (
              <motion.div
                className={`animation-item animation-item--${item.type}`}
                key={item.id} // Required for AnimatePresence to track instances
                animate={{ opacity: [0, 1, 0], ...posAnim }}
                transition={{
                  duration: animationDurationSec,
                  ease: "linear",
                  times: [0, 0.5, 1],
                }}
              >
                {item.qty !== undefined && (
                  <span>
                    {item.qty > 0 && "+"}
                    {item.qty === 0 && item.type === "damage" && "-"}
                    {item.qty === 0 && item.type === "heal" && "+"}
                    {item.qty}
                  </span>
                )}

                {item.type === "coins" && <CoinIcon />}
                {/* {item.type === "heal" && <HeartIcon />} */}
                {/* {item.type === "damage" && <HeartIcon />} */}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    ),
    triggerAnimation,
  };
};
