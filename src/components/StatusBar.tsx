import clsx from "clsx";
import type React from "react";

interface ProgressBarProps {
  type: string;
  icon: React.ReactNode;
  progress?: number; // 0 to 1
  value?: number;
  total: number;
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
    <div
      className={clsx(
        "status-bar",
        `status-bar--${type}`,
        value === undefined && "status-bar--na",
      )}
    >
      <div className="status-bar__icon">{icon}</div>

      <div className="status-bar__bar">
        {progress !== undefined && (
          <div
            className="status-bar__bar__progress"
            style={{ width: `${progress * 100}%` }}
          />
        )}
      </div>

      <span className="status-bar__text">
        <span className="status-bar__text__current">
          {value === undefined ? "--" : value}
        </span>
        <span className="status-bar__text__total"> / {total ?? "--"}</span>
      </span>

      {children}
    </div>
  );
};
