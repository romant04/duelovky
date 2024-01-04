import { FC } from "react";

interface Props {
  letter: string;
}

export const Letter: FC<Props> = ({ letter }) => {
  return (
    <span className="rounded-lg bg-white p-5 font-semibold">{letter}</span>
  );
};
