import { FC } from "react";
import { clsx } from "clsx";

interface Props {
  username: string;
  mmr: number;
  position: number;
}

export const LedderRow: FC<Props> = ({ username, mmr, position }) => {
  return (
    <div
      className={clsx(
        "flex justify-between px-5 py-3",
        position === 1
          ? "bg-yellow-400 text-black"
          : position === 2
          ? "bg-gray-400 text-black"
          : position === 3
          ? "bg-amber-600 text-black"
          : position % 2 !== 0
          ? "bg-gray-750"
          : "bg-gray-600"
      )}
    >
      <div className="flex gap-2">
        <span>{position}.</span>
        <h1>{username}</h1>
      </div>
      <span>{mmr} mmr</span>
    </div>
  );
};
