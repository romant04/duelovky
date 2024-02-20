import { FC, useEffect, useState } from "react";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";

interface Props {
  start?: () => void;
}

export const GameLoader: FC<Props> = ({ start }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (start !== undefined) {
        start();
      }
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="absolute left-0 top-0 z-[99999999] flex h-full w-full flex-col items-center justify-center gap-5 bg-gray-800 text-5xl">
      <h2 className="text-white">Loading game</h2>
      <div>
        <LoadingSpinnerGreen />
      </div>
    </div>
  );
};
