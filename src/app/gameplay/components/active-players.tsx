import { FC } from "react";

interface Props {
  activePlayers: number;
}

export const ActivePlayers: FC<Props> = ({ activePlayers }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-3 w-3 rounded-full bg-green-500">
        <div className="h-full w-full rounded-full bg-green-400 blur" />
      </div>
      <p>
        {activePlayers}{" "}
        {activePlayers >= 2 && activePlayers <= 4
          ? "hráči"
          : activePlayers == 1
          ? "hráč"
          : "hráčů"}{" "}
        ve frontě
      </p>
    </div>
  );
};
