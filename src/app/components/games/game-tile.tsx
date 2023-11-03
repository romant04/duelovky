import { FC } from "react";
import { GameTag, tags } from "@/app/components/games/game-tag";

interface Props {
  title: string;
  description: string;
  tags: tags[];
}

export const GameTile: FC<Props> = ({ title, description, tags }) => {
  return (
    <div className="flex max-w-md cursor-pointer flex-col gap-2 bg-gray-750 p-4 hover:bg-gray-700">
      <h2 className="text-2xl">{title}</h2>
      <p>{description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {tags.map((tag) => (
          <GameTag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
};
