import { FC } from "react";
import { clsx } from "clsx";

interface Props {
  name: string;
  score: number;
  guessed_words: number;
  left: boolean;
}

export const InfoTab: FC<Props> = ({ name, score, guessed_words, left }) => {
  return (
    <div
      className={clsx(
        "absolute top-10 h-36 w-64 rounded-md border-2 border-lime-900 bg-lime-700 p-3 text-white",
        left ? "left-10" : "right-10"
      )}
    >
      <h1 className="text-xl font-semibold">
        {name} - <span>{score}</span>
      </h1>
      <h2 className="mt-2 text-lg">
        Uhádlá slova: <span>{guessed_words}</span>
      </h2>
    </div>
  );
};
