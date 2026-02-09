import {
  ItemIcon,
  ItemTypes,
  type DungeonState,
  type ItemType,
  type PlayerState,
} from "../../utils/types";
import { Modal } from "./Modal";
import "./InventoryModal.scss";
import { BackpackIcon } from "../icons/Backpack";
import { HomeIcon } from "../icons/Home";
import type { Dispatch, SetStateAction } from "react";
import { maxHealth } from "../../utils/constants";

interface InventoryModalProps {
  onClose: () => void;
  dungeonState: DungeonState;
  setDungeonState: Dispatch<SetStateAction<DungeonState>>;
  playerState: PlayerState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

export const InventoryModal = ({
  onClose,
  dungeonState,
  setDungeonState,
  playerState,
  setPlayerState,
}: InventoryModalProps) => {
  const ItemRow = ({ type }: { type: ItemType }) => {
    const Icon = ItemIcon[type];

    const buttonDisabled = () => {
      if (type === ItemTypes.Potion) {
        return (
          playerState.inventoryPack.Potion === 0 ||
          dungeonState.health === maxHealth
        );
      }
      // else if (type === ItemTypes.Rat) {
      //   return true;
      // } else if (type === ItemTypes.Bomb) {
      //   return true;
      // }

      return true;
    };

    const buttonAction = () => {
      if (type === ItemTypes.Potion) {
        setPlayerState((prev) => ({
          ...prev,
          inventoryPack: {
            ...playerState.inventoryPack,
            [ItemTypes.Potion]: playerState.inventoryPack.Potion - 1,
          },
        }));
        setDungeonState((prev) => ({
          ...prev,
          health: Math.min(dungeonState.health + 3, maxHealth),
        }));
      } else {
        console.log("Use " + type);
      }
    };

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
        <td>
          {type !== ItemTypes.Coin && (
            <button
              className="plain-btn small-btn"
              onClick={() => {
                buttonAction();
                onClose();
              }}
              disabled={buttonDisabled()}
            >
              Use
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <Modal
      title="Inventory"
      isOpen
      onClose={onClose}
      modalClass="win-lose-modal win-lose-modal--lose small-modal"
    >
      <div>
        <table className="inventory-table inventory-table--modal">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>
                <HomeIcon />
              </th>
              <th>
                <BackpackIcon />
              </th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ItemTypes).map((type) => (
              <ItemRow key={type} type={type} />
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
