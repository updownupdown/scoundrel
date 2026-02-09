import {
  ItemIcon,
  ItemTypes,
  type DungeonState,
  type ItemType,
  type PlayerState,
} from "../../utils/types";
import { Modal } from "./Modal";
import type { ModalType } from "./ModalEmbeds";
import "./DungeonEndModal.scss";
import { BackpackIcon } from "../icons/Backpack";
import { HomeIcon } from "../icons/Home";
import { DoorIcon } from "../icons/Door";
import { HealthBar } from "../dungeon/HealthBar";
import { CoinIcon } from "../icons/Coin";

interface DungeonEndProps {
  dungeonState: DungeonState;
  playerState: PlayerState;
  setOpenModal: (modal: ModalType | undefined) => void;
  dungeonExit: () => void;
  dungeonContinue: () => void;
}

export const DungeonEndModal = ({
  dungeonState,
  playerState,
  setOpenModal,
  dungeonExit,
  dungeonContinue,
}: DungeonEndProps) => {
  const ItemRow = ({ type }: { type: ItemType }) => {
    const Icon = ItemIcon[type];

    return (
      <tr>
        <td>
          <div className="inv-table-name">
            <Icon />
            <span>{type}s</span>
          </div>
        </td>
        <td>{playerState.inventoryHome[type]}</td>
        <td>{playerState.inventoryPack[type]}</td>
      </tr>
    );
  };

  return (
    <Modal isOpen onClose={() => {}} modalClass="dungeon-end-modal small-modal">
      <div className="dungeon-end">
        <div className="dungeon-end__title">
          <span className="dungeon-end__title__small">
            You've reached the end of
          </span>
          <span className="dungeon-end__title__large">
            Dungeon {dungeonState.currentDungeon}
          </span>
          <div className="dungeon-end__title__score">
            <span>Score: {dungeonState.score}</span>
          </div>
        </div>

        <div className="dungeon-end__treasure">
          <span className="dungeon-end__treasure__found">You found:</span>
          <span className="color-gold">{dungeonState.foundGold}</span>
          <CoinIcon />
        </div>

        <table className="inventory-table inventory-table--dungeon-end">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>
                <HomeIcon />
              </th>
              <th>
                <BackpackIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ItemTypes).map((type) => (
              <ItemRow key={type} type={type} />
            ))}
          </tbody>
        </table>

        <HealthBar dungeonState={dungeonState} />

        <div className="dungeon-end__choices">
          <button
            className="plain-btn green-btn"
            onClick={() => {
              dungeonExit();
            }}
          >
            <HomeIcon />
            <b>Go home</b>
            <span>and keep loot</span>
          </button>

          <button
            className="plain-btn red-btn"
            onClick={() => {
              dungeonContinue();
            }}
          >
            <DoorIcon />
            <b>Continue</b>
            <span>to Dungeon {dungeonState.currentDungeon + 1}</span>
          </button>
        </div>

        <div className="dungeon-end__tips">Deeper dungeons have more gold.</div>
      </div>
    </Modal>
  );
};
