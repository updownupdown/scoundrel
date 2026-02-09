import {
  HomeTabs,
  ItemCost,
  ItemIcon,
  ItemTypes,
  type DungeonState,
  type HomeTab,
  type ItemType,
  type PlayerState,
} from "../../utils/types";
import "./Home.scss";
import { ArrowBackIcon } from "../icons/ArrowBack";
import { ArrowForwardIcon } from "../icons/ArrowForward";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { CoinIcon } from "../icons/Coin";
import { HomeIcon } from "../icons/Home";
import { BackpackIcon } from "../icons/Backpack";
import clsx from "clsx";
import { Stats } from "../misc/Stats";

interface HomeProps {
  gameStart: () => void;
  playerState: PlayerState;
  dungeonState: DungeonState;
  setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

export const Home = ({
  gameStart,
  playerState,
  setPlayerState,
  dungeonState,
}: HomeProps) => {
  const [homeTab, setHomeTab] = useState<HomeTab>(HomeTabs.Home);

  useEffect(() => {
    // Move coins from pack to home
    setPlayerState((prev) => ({
      ...prev,
      inventoryHome: {
        ...playerState.inventoryHome,
        [ItemTypes.Coin]:
          playerState.inventoryHome[ItemTypes.Coin] +
          playerState.inventoryPack[ItemTypes.Coin],
      },
      inventoryPack: {
        ...playerState.inventoryPack,
        [ItemTypes.Coin]: 0,
      },
    }));
  }, []);

  const InventoryRow = ({ type }: { type: ItemType }) => {
    const Icon = ItemIcon[type];

    return (
      <tr>
        <td>
          <div className="inv-table-name">
            <Icon />
            <span>{type}s</span>
          </div>
        </td>
        <td>
          <span
            className={clsx(
              "inv-qty",
              playerState.inventoryHome[type] === 0 && "inv-qty--none",
            )}
          >
            {playerState.inventoryHome[type]}
          </span>
        </td>
        <td>
          {type !== ItemTypes.Coin && (
            <div className="inv-table-buttons">
              <button
                className="plain-btn"
                onClick={() => {
                  setPlayerState((prev) => ({
                    ...prev,
                    inventoryHome: {
                      ...playerState.inventoryHome,
                      [type]: playerState.inventoryHome[type] + 1,
                    },
                    inventoryPack: {
                      ...playerState.inventoryPack,
                      [type]: playerState.inventoryPack[type] - 1,
                    },
                  }));
                }}
                disabled={playerState.inventoryPack[type] === 0}
              >
                <ArrowBackIcon />
              </button>
              <button
                className="plain-btn"
                onClick={() => {
                  setPlayerState((prev) => ({
                    ...prev,
                    inventoryHome: {
                      ...playerState.inventoryHome,
                      [type]: playerState.inventoryHome[type] - 1,
                    },
                    inventoryPack: {
                      ...playerState.inventoryPack,
                      [type]: playerState.inventoryPack[type] + 1,
                    },
                  }));
                }}
                disabled={playerState.inventoryHome[type] === 0}
              >
                <ArrowForwardIcon />
              </button>
            </div>
          )}
        </td>
        <td>
          <span
            className={clsx(
              "inv-qty",
              playerState.inventoryPack[type] === 0 && "inv-qty--none",
            )}
          >
            {playerState.inventoryPack[type]}
          </span>
        </td>
      </tr>
    );
  };

  const BuyButton = ({ type }: { type: ItemType }) => {
    const cost = ItemCost[type];
    const Icon = ItemIcon[type];

    return (
      <div className="shop__items__item">
        <span className="shop__items__item__name">
          <Icon />
          <span>{type}s</span>
        </span>

        <span className="shop__items__item__owned">
          {playerState.inventoryHome[type]}
        </span>

        <div className="shop__items__item__buy">
          {cost && (
            <button
              className="plain-btn gold-btn"
              onClick={() => {
                setPlayerState((prev) => ({
                  ...prev,
                  inventoryHome: {
                    ...playerState.inventoryHome,
                    [ItemTypes.Coin]:
                      playerState.inventoryHome[ItemTypes.Coin] - cost,
                    [type]: playerState.inventoryHome[type] + 1,
                  },
                }));
              }}
              disabled={playerState.inventoryHome[ItemTypes.Coin] < cost}
            >
              <span>
                <b>Buy</b> for {cost}
              </span>
              <CoinIcon />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      {playerState.lastGameWon !== undefined && (
        <div
          className={clsx(
            "home__results",
            playerState.lastGameWon === true && "home__results--won",
            playerState.lastGameWon === false && "home__results--lost",
          )}
        >
          {playerState.lastGameWon === true && (
            <>
              <h2>You made it out of dungeon {dungeonState.currentDungeon}!</h2>
              <h5>Score: {dungeonState.score}</h5>
            </>
          )}
          {playerState.lastGameWon === false && (
            <>
              <h2>You died!</h2>
              <h5>
                Dungeon: {dungeonState.currentDungeon}
                <br />
                Room: {dungeonState.currentRoom}
                <br />
                Score: {dungeonState.score}
              </h5>
            </>
          )}
        </div>
      )}

      <div className="home__tabs-content">
        <div className="home__tabs-content__tabs">
          {Object.values(HomeTabs).map((tab) => {
            return (
              <button
                key={tab}
                onClick={() => setHomeTab(tab)}
                disabled={homeTab === tab}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="home__tabs-content__content">
          {homeTab === HomeTabs.Home && (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>
                    <HomeIcon />
                  </th>
                  <th>&nbsp;</th>
                  <th>
                    <BackpackIcon />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ItemTypes).map((type) => (
                  <InventoryRow key={type} type={type} />
                ))}
              </tbody>
            </table>
          )}

          {homeTab === HomeTabs.Shop && (
            <div className="shop">
              <div className="shop__items">
                {Object.values(ItemTypes).map((type) => (
                  <BuyButton key={type} type={type} />
                ))}
              </div>
            </div>
          )}

          {homeTab === HomeTabs.Character && (
            <div className="character">
              <Stats playerState={playerState} />
            </div>
          )}
        </div>
      </div>

      <button
        className="plain-btn red-btn large-btn"
        onClick={() => gameStart()}
      >
        Go Dungeon Crawl
      </button>
    </div>
  );
};
