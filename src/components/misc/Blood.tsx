import React, { useEffect, useRef, useState } from "react";
import "./Blood.scss";
import gsap, { Power0, Power1, Power2, Power3 } from "gsap";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const Blood = () => {
  const [animCompleted, setAnimCompleted] = useState(false);
  const [resized, setResized] = useState(false);
  const svgContainer = useRef<SVGSVGElement>(null);
  const svgGroup = useRef<SVGSVGElement>(null);

  const strokeWidth = 15;
  const fadeOutDelay = 5;
  const tl = gsap.timeline({ paused: true });
  const power = [Power0, Power1, Power2, Power3];

  let boxHeight = svgContainer.current?.getBoundingClientRect().height;
  let boxWidth = svgContainer.current?.getBoundingClientRect().width;
  let clearSVG: any;

  function removeLines() {
    if (!animCompleted || !svgGroup.current) return;

    while (svgGroup.current.childElementCount > 0) {
      if (svgGroup.current.firstChild) {
        svgGroup.current?.removeChild(svgGroup.current.firstChild);
      }
    }

    addLines();
  }

  function addLines() {
    const fragment = document.createDocumentFragment();

    boxHeight = svgContainer.current?.getBoundingClientRect().height;
    boxWidth = svgContainer.current?.getBoundingClientRect().width;
    svgContainer.current?.setAttribute(
      "viewbox",
      `0 0 ${boxWidth} ${boxHeight}`,
    );

    if (!boxWidth) return;

    for (let i = Math.ceil(boxWidth / strokeWidth); i > 0; i--) {
      const posX = (i - 1) * strokeWidth;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      const ease = getRandomArbitrary(0, 2);

      line.setAttribute("x1", posX.toString());
      line.setAttribute("x2", posX.toString());
      line.setAttribute("y1", "0");
      line.setAttribute("y2", "100%");
      line.setAttribute(
        "style",
        `stroke-width: ${strokeWidth + 2}; stroke-dasharray: ${boxHeight}; stroke-dashoffset: ${boxHeight};`,
      );

      fragment.appendChild(line);

      tl.fromTo(
        line,
        { strokeDashoffset: boxHeight },
        {
          strokeDashoffset: 0,
          duration: getRandomArbitrary(4, 6),
          delay: Math.round(getRandomArbitrary(0, 1) * 100) / 100,
          ease: power[Math.round(getRandomArbitrary(0, 3))][
            `ease${ease ? (ease === 1 ? "In" : "Out") : "InOut"}`
          ],
        },
        0,
      );
    }

    svgGroup.current?.appendChild(fragment);
  }

  tl.eventCallback("onComplete", () => {
    svgContainer.current?.setAttribute("class", "hidden");
    setTimeout(() => {
      setAnimCompleted(true);
      tl.restart().pause();
      if (resized) {
        setResized(false);
        removeLines();
      }
    }, fadeOutDelay * 1000);
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (animCompleted) {
        clearTimeout(clearSVG);
        clearSVG = setTimeout(removeLines, 500);
      } else {
        setResized(true);
      }
    });

    svgContainer.current?.setAttribute(
      "style",
      `height: calc(100vh + ${strokeWidth * 3}px);`,
    );

    addLines();

    svgContainer.current?.setAttribute("class", "");

    tl.play();
  }, []);

  return (
    <div className="blood">
      <svg
        ref={svgContainer}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin slice"
      >
        <filter id="liquify">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values=".15 0 0 0 0,  0 0 0 0 0,  0 0 0 0 0,  0 0 0 100 -20"
          />
        </filter>
        <g ref={svgGroup} filter="url(#liquify)"></g>
      </svg>
    </div>
  );
};
