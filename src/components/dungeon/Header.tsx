import { useEffect, useRef, useState } from "react";
import "./Header.scss";
import { D20Icon } from "../icons/D20";
import { MenuIcon } from "../icons/Menu";
import { Modals, type ModalType } from "../modals/ModalEmbeds";
import clsx from "clsx";
import { CloseIcon } from "../icons/Close";

interface HeaderProps {
  setOpenModal: (modal: ModalType) => void;
}

export const Header = ({ setOpenModal }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMenuOpenRef = useRef(isMenuOpen);
  isMenuOpenRef.current = isMenuOpen;
  const menuWrapRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside of it
  const handleClick = (event: PointerEvent) => {
    const target = event.target;

    if (
      isMenuOpenRef.current &&
      menuWrapRef.current &&
      !menuWrapRef.current.contains(target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e) => handleClick(e));

    return () => {
      document.removeEventListener("click", (e) => handleClick(e));
    };
  }, []);

  return (
    <div className="header">
      <div className="header__title">
        <D20Icon />
        <span className="header__title__scoundrel">Scoundrel</span>
        <span className="header__title__mode">Rogue</span>
      </div>

      <div ref={menuWrapRef} className="menu-wrap">
        <button
          className={clsx(
            "menu-toggle-btn",
            isMenuOpen && "menu-toggle-btn--hide",
          )}
          type="button"
          onClick={() => {
            setIsMenuOpen(true);
          }}
        >
          <span>Menu</span>
          <MenuIcon />
        </button>

        {isMenuOpenRef.current && (
          <div className={clsx("menu")}>
            <button
              className="menu-toggle-btn"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <span>Close</span>
              <CloseIcon />
            </button>

            <button
              className="menu-item-btn"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setOpenModal(Modals.HowToPlay);
              }}
            >
              How to Play
            </button>

            <button
              className="menu-item-btn"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setOpenModal(Modals.Stats);
              }}
            >
              Stats
            </button>

            <button
              className="menu-item-btn"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setOpenModal(Modals.About);
              }}
            >
              About &amp; Credits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
