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
import { coinsPerDungeonEnd } from "../../utils/constants";

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
        <h4>You've reached the end of dungeon {dungeonState.currentDungeon}</h4>

        <p>You gain {coinsPerDungeonEnd} coins</p>

        <h5>
          Health: {dungeonState.health}
          <br />
          Score: {dungeonState.score}
        </h5>

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

        <button
          className="plain-btn green-btn"
          onClick={() => {
            dungeonExit();
          }}
        >
          Go home (and keep loot)
        </button>

        <button
          className="plain-btn red-btn"
          onClick={() => {
            dungeonContinue();
          }}
        >
          Continue to Dungeon {dungeonState.currentDungeon + 1}
        </button>
      </div>
    </Modal>
  );
};
