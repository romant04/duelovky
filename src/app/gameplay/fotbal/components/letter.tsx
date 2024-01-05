import { FC } from "react";

interface Props {
  letter: string;
  onClick?: () => void;
}

export const Letter: FC<Props> = ({ letter, onClick }) => {
  return (
    <span
      onClick={onClick}
      className="flex h-14 w-12 cursor-pointer items-center justify-center rounded-lg bg-white p-2 text-xl font-semibold"
    >
      {letter.toUpperCase()}
    </span>
  );
};
