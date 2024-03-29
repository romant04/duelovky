import { FC, useEffect, useState } from "react";
import { clsx } from "clsx";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  code: string;
}

export const FriendWaitDialog: FC<Props> = ({ isOpen, code, setIsOpen }) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
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
        "fixed left-0 top-0 z-50 flex items-center justify-center bg-black/30",
        isOpen ? "visible h-full w-full" : " invisible h-0 w-0"
      )}
    >
      <div className="mx-5 flex w-full flex-col gap-4 rounded-md bg-gray-750 p-4 md:w-1/2">
        <div>
          <h1 className="text-3xl">Čekání na kamaráda{dots}</h1>
        </div>
        <div>
          <h2 className="text-lg text-gray-200">
            Odkaz pro kamaráda na připojení do hry
          </h2>
          <div className="bg-gray-500 p-2 font-semibold text-lime-400">{`${window.location.href}/${code}`}</div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="w-full bg-lime-600 py-2 hover:bg-lime-500"
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.href}/${code}`)
              }
            >
              Zkopírovat do schránky
            </button>
            <button
              className="w-full bg-red-600 py-2 hover:bg-red-500"
              onClick={() => setIsOpen(false)}
            >
              Zrušit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
