import { FC, useState } from "react";
import { GAME_DATA } from "@/app/main/game/game-data";
import { clsx } from "clsx";

interface Props {
  activeGame: string;
  setActiveGame: (game: string) => void;
}

export const LedderFilter: FC<Props> = ({ setActiveGame, activeGame }) => {
  const [selected, setSelected] = useState<string>(activeGame);

  const handleSelect = (game: string) => {
    setSelected(game);
    setActiveGame(game);
  };

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      {GAME_DATA.map((game) => (
        <button
          className={clsx(
            "rounded-sm px-5 py-2",
            selected === game.game_id
              ? "bg-lime-800"
              : "bg-lime-600 hover:bg-lime-700"
          )}
          key={game.title}
          onClick={() => handleSelect(game.game_id)}
        >
          {game.title}
        </button>
      ))}
    </div>
  );
};
