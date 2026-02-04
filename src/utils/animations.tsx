import gsap from "gsap";

function getPosFromEl(el: HTMLElement | null) {
  if (!el) return { x: 0, y: 0 };
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
}

export async function animateCard(
  card: string,
  target: "weapon-equip" | "weapon-monster" | "potion" | "barefist",
) {
  const cardEl: HTMLElement | null = document.querySelector(`.card--${card}`);
  if (!cardEl) return;
  const cardElRect = cardEl.getBoundingClientRect();

  let targetEl: HTMLElement | null = null;
  let targetPos = { x: 0, y: 0 };
  let offset = { x: 0, y: 0 };
  let opacity = undefined;
  let scale = undefined;
  let duration = 0.2;

  if (target === "weapon-equip") {
    // Equip weapon
    targetEl = document.querySelector(".weapons__weapon");
    targetPos = getPosFromEl(targetEl);
  } else if (target === "weapon-monster") {
    // Fight - weapon
    targetEl = document.querySelector(".weapons__cards");
    targetPos = getPosFromEl(targetEl);

    const weaponCardsNum =
      document.querySelectorAll(".weapons__cards .card").length ?? 0;
    const weaponCardsContainer = document.querySelector(
      ".weapons__cards",
    ) as HTMLElement;
    const weaponsCardXOffset =
      weaponCardsContainer.offsetWidth * weaponCardsNum * 0.12;

    offset = { x: weaponsCardXOffset, y: 0 };
  } else if (target === "potion") {
    // Heal
    targetEl = cardEl;
    targetPos = getPosFromEl(targetEl);

    opacity = 0;
    scale = 1.8;
    duration = 0.4;
  } else if (target === "barefist") {
    // Fight - barefist
    targetEl = cardEl;
    targetPos = getPosFromEl(targetEl);

    opacity = 0;
    scale = 0.2;
    duration = 0.4;
  }

  const clonedItem = cardEl.cloneNode(true) as HTMLElement;
  clonedItem.classList.add("ghost", `ghost-${card}`);
  clonedItem.style.position = "absolute";
  clonedItem.style.top = "0";
  clonedItem.style.left = "0";
  clonedItem.style.zIndex = "100";

  const wrapEl: HTMLElement | null = document.querySelector(`.wrap`);
  if (!wrapEl) return;
  wrapEl.appendChild(clonedItem);

  gsap.to(`.ghost-${card}`, {
    x: cardElRect.x,
    y: cardElRect.y,
    duration: 0,
  });

  clonedItem.style.visibility = "visible";
  cardEl.classList.add("card--empty");

  await gsap.to(`.ghost-${card}`, {
    x: targetPos.x + offset.x,
    y: targetPos.y + offset.y,
    duration: 0.3,
    ease: "power2.inOut",
    opacity,
    scale,
  });
}

export async function animationCleanup() {
  // Remove ghosts
  const ghostEls = document.querySelectorAll(".ghost");

  for (const ghostEl of ghostEls) {
    ghostEl.remove();
  }
}
