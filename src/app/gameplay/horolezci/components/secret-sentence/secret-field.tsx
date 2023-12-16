import { FC } from "react";
import { clsx } from "clsx";
import { SOLID_CHARACTERS } from "@/pages/data/horolezci";

interface Props {
  character: string;
}

export const SecretField: FC<Props> = ({ character }) => {
  const charDepStyles = SOLID_CHARACTERS.includes(character)
    ? "bg-gray-800 flex items-end"
    : "bg-lime-600 w-10 h-12 flex items-center justify-center font-bold";

  return (
    <div
      className={clsx(
        "flex rounded-full text-lg",
        charDepStyles,
        character === " " && "px-2"
      )}
    >
      {character.toUpperCase()}
    </div>
  );
};
