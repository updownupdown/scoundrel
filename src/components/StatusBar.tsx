import clsx from "clsx";
import type React from "react";
import "./StatusBar.scss";

interface ProgressBarProps {
  type: string;
  icon: React.ReactNode;
  progress?: number; // 0 to 1
  value?: number;
  total?: number;
  children?: React.ReactNode;
}

export const StatusBar = ({
  type,
  total,
  progress,
  value,
  icon,
  children,
}: ProgressBarProps) => {
  return (
    <div className="status-bar-wrap">
      <div
        className={clsx(
          "status-bar",
          `status-bar--${type}`,
          value === undefined && "status-bar--na",
        )}
      >
        <div className="status-bar__icon">{icon}</div>
        <div
          className="status-bar__progress"
          style={{ width: `${(progress ?? 0) * 100}%` }}
        />
        <span className="status-bar__text">
          <span>
            {value !== undefined ? value : <span className="pale">--</span>}

            <span className="pale"> / {total ?? "--"}</span>
          </span>
        </span>
      </div>

      {children && <div className="status-bar-children">{children}</div>}
    </div>
  );
};
