import { FC, useEffect, useState } from "react";
import { clsx } from "clsx";

interface Props {
  isOpen: boolean;
  stopMatchmaking: () => void;
}

export const MatchmakingDialog: FC<Props> = ({ isOpen, stopMatchmaking }) => {
  const [dots, setDots] = useState(".");
  const [time, setTime] = useState(0);

  const stopSearch = () => {
    setTime(0);
    setDots(".");
    stopMatchmaking();
  };

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      setDots((prev) =>
        prev === "." ? ". ." : prev === ". ." ? ". . ." : "."
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

  return (
    <div
      className={clsx(
        "fixed left-0 top-0 flex items-center justify-center bg-black/30",
        isOpen ? "visible h-full w-full" : " invisible h-0 w-0"
      )}
    >
      <div className="flex w-1/2 flex-col gap-4 rounded-md bg-gray-750 p-4">
        <div>
          <h1 className="text-3xl">Matchmaking</h1>
        </div>
        <div>
          <h2 className="text-lg text-gray-200">
            Hledání protivníka pro Horolezce{dots}
          </h2>
          <span>{time}s</span>
        </div>
        <button
          className="mt-4 bg-red-600 py-2 hover:bg-red-700"
          onClick={stopSearch}
        >
          ZRUŠIT
        </button>
      </div>
    </div>
  );
};
