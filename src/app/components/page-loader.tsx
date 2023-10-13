"use client";

import { FC, useEffect, useState } from "react";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";
import { clsx } from "clsx";

export const PageLoader: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountingTimeout = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => {
      clearTimeout(mountingTimeout);
    };
  }, []);

  // TODO: Replace with custom loading spinner
  return (
    <div
      className={clsx(
        mounted
          ? "invisible h-0 w-0"
          : "fixed left-0 top-0 z-[9999999] flex h-screen w-screen items-center justify-center bg-black"
      )}
    >
      <LoadingSpinnerGreen />
    </div>
  );
};
