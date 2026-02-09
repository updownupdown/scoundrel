import { type PlayerState } from "../../utils/types";
import "./Stats.scss";

interface StatsProps {
  playerState: PlayerState;
}

export const Stats = ({ playerState }: StatsProps) => {
  function getPerc(num: number) {
    const totalGames = playerState.gamesWon + playerState.gamesLost;
    if (totalGames === 0) return "0%";
    return `${Math.round((num / totalGames) * 100)}%`;
  }

  return (
    <div className="stats">
      <div className="stats-bar">
        <div
          className="stats-bar__bar stats-bar__bar--green"
          style={{ width: getPerc(playerState.gamesWon) }}
        />
        <div
          className="stats-bar__bar stats-bar__bar--red"
          style={{ width: getPerc(playerState.gamesLost) }}
        />
      </div>

      <div className="stats__games">
        <span className="stats__games__cat color-green">
          <span>Won: {playerState.gamesWon}</span>
          <span>{getPerc(playerState.gamesWon)}</span>
        </span>
        <span className="stats__games__cat color-red">
          <span>Lost: {playerState.gamesLost}</span>
          <span>{getPerc(playerState.gamesLost)}</span>
        </span>
      </div>

      <div className="stats__general">
        <ul>
          <li>
            Average room reached (within single dungeons):{" "}
            {playerState.avgLastRoom
              ? Math.round(playerState.avgLastRoom * 10) / 10
              : "N/A"}
          </li>
          <li>
            Average room reached (across crawls):{" "}
            {playerState.avgLastRoomAcrossDungeons
              ? Math.round(playerState.avgLastRoomAcrossDungeons * 10) / 10
              : "N/A"}
          </li>
          <li>
            Average dungeon reached:{" "}
            {playerState.avgLastDungeon
              ? Math.round(playerState.avgLastDungeon * 10) / 10
              : "N/A"}
          </li>
          <li>
            Total games played: {playerState.gamesWon + playerState.gamesLost}
          </li>
        </ul>
      </div>
    </div>
  );
};
