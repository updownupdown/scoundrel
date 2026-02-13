import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { CoinIcon } from "../icons/Coin";
import "./Animations.scss";
import { Card } from "./Card";
import { RatIcon } from "../icons/Rat";

export const defaultAnimationDurationSec = 1.5;
export const animationDurationSec = 1.5;
export const actionAnimationDurationSec = 0.5;

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

function getPosFromEl(el: HTMLElement | null) {
  if (!el) return { x: 0, y: 0 };
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

export type AnimationItems =
  | "coins"
  | "rat"
  | "heal"
  | "damage"
  | "xp"
  | "card";

type AnimationProps = {
  type: AnimationItems;
  qty?: number;
  card?: string;

  startOffset?: { x: number; y: number };
  endOffset?: { x: number; y: number };
  targetClass?: string;
  targetType?: "weapon-equip" | "weapon-monster" | "potion" | "barefist";
  duration?: number;
};

type AnimationItemProps = AnimationProps & {
  id: string;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  scale?: number;
  opacity?: number;
};

export const useAnimations = () => {
  const [items, setItems] = useState<AnimationItemProps[]>([]);

  function triggerAnimation({
    type,
    duration,
    qty,
    card,
    startOffset,
    endOffset,
    targetType,
    targetClass,
  }: AnimationProps) {
    const id = Date.now().toString() + type;

    let startPosition = { x: 0, y: 0 };
    let endPosition = { x: 0, y: 0 };
    let scale: number | undefined = undefined;
    let opacity: number | undefined = undefined;
    const cardEl: HTMLElement | null = card
      ? document.querySelector(`.room-cards .card--${card}`)
      : null;

    if (targetClass) {
      const target = getCenterByClass(targetClass);
      if (target) {
        startPosition = endPosition = target;
      }
    } else if (targetType === "weapon-equip") {
      // Equip weapon
      if (!cardEl) return;

      const targetEl: HTMLElement | null =
        document.querySelector(".weapons__weapon");

      startPosition = getPosFromEl(cardEl);
      endPosition = getPosFromEl(targetEl);

      cardEl.classList.add("card--empty");
      opacity = 1;
    } else if (targetType === "weapon-monster") {
      // Fight - weapon
      if (!cardEl) return;

      const targetEl: HTMLElement | null =
        document.querySelector(".weapons__cards");

      startPosition = getPosFromEl(cardEl);
      endPosition = getPosFromEl(targetEl);

      const weaponCardsNum =
        document.querySelectorAll(".weapons__cards .card").length ?? 0;
      const weaponCardsContainer = document.querySelector(
        ".weapons__cards",
      ) as HTMLElement;
      const weaponsCardXOffset =
        weaponCardsContainer.offsetWidth * weaponCardsNum * 0.12;

      endPosition = { x: endPosition.x + weaponsCardXOffset, y: endPosition.y };

      cardEl.classList.add("card--empty");
      opacity = 1;
    } else if (targetType === "barefist") {
      // Barefist
      if (!cardEl) return;

      startPosition = getPosFromEl(cardEl);
      endPosition = startPosition;

      cardEl.classList.add("card--empty");
      scale = 0.2;
      opacity = 0;
    } else if (targetType === "potion") {
      // Heal
      if (!cardEl) return;

      startPosition = getPosFromEl(cardEl);
      endPosition = startPosition;

      cardEl.classList.add("card--empty");
      scale = 0.5;
      opacity = 0;
    }

    if (startPosition && startOffset) {
      startPosition = {
        x: startPosition.x + startOffset.x,
        y: startPosition.y + startOffset.y,
      };
    }
    if (endPosition && endOffset) {
      startPosition = {
        x: endPosition.x + endOffset.x,
        y: endPosition.y + endOffset.y,
      };
    }

    setItems((prev) => [
      ...prev,
      {
        id,
        type,
        qty,
        card,
        scale,
        opacity,
        duration,
        startPos: startPosition,
        endPos: endPosition,
      },
    ]);

    setTimeout(
      () => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      },
      (duration ?? defaultAnimationDurationSec) * 1000,
    );
  }

  return {
    animationsWrap: (
      <div className="animations">
        <AnimatePresence key="anim">
          {items.map((item) => {
            let posAnim = undefined;

            if (item.startPos && item.endPos) {
              if (item.type === "card") {
                posAnim = {
                  x: [item.startPos.x, item.endPos.x],
                  y: [item.startPos.y, item.endPos.y],
                };
              } else {
                const deltaX = item.endPos.x - item.startPos.x;
                const deltaY = item.endPos.y - item.startPos.y;

                posAnim = {
                  x: [
                    item.startPos.x,
                    item.startPos.x + deltaX / 2,
                    item.startPos.x + deltaX,
                  ],
                  y: [
                    item.startPos.y,
                    item.startPos.y + deltaY / 2,
                    item.startPos.y + deltaY,
                  ],
                };
              }
            }

            const opacity = item.opacity ?? [0, 1, 0];
            const times = item.type === "card" ? undefined : [0, 0.5, 1];

            return (
              <motion.div
                className={`animation-item animation-item--${item.type}`}
                key={item.id}
                animate={{
                  opacity,
                  ...posAnim,
                  scale: item.scale ? [1, item.scale] : undefined,
                }}
                transition={{
                  duration: item.duration ?? defaultAnimationDurationSec,
                  ease: "easeInOut",
                  times,
                }}
              >
                {item.type === "card" && <Card card={item.card} />}

                {item.qty !== undefined && (
                  <span>
                    {item.qty > 0 && "+"}
                    {item.qty === 0 && item.type === "damage" && "-"}
                    {item.qty === 0 && item.type === "heal" && "+"}
                    {item.qty}
                  </span>
                )}

                {item.type === "coins" && <CoinIcon />}
                {item.type === "rat" && <RatIcon />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    ),
    triggerAnimation,
  };
};
