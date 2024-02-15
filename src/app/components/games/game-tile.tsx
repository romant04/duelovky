import { FC } from "react";
import { GameTag, tags } from "@/app/components/games/game-tag";
import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  description: string;
  tags: tags[];
  mobile: boolean;
  image: StaticImageData;
}

export const GameTile: FC<Props> = ({
  title,
  description,
  tags,
  mobile,
  image,
}) => {
  return (
    <div className="flex h-full max-w-md cursor-pointer flex-col gap-2 bg-gray-750 p-4 hover:bg-gray-700">
      <Image src={image} alt="" />
      <div className="mt-3 flex justify-between">
        <h2 className="text-2xl">{title}</h2>
        {mobile && (
          <p className="text-sm tracking-widest text-lime-400">
            (mobile-friendly)
          </p>
        )}
      </div>
      <p>{description}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {tags.map((tag) => (
          <GameTag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
};
