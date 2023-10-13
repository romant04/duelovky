"use client";

import { FC, useEffect, useState } from "react";
import { clsx } from "clsx";
import "./pageloader.css";

export const PageLoader: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountingTimeout = setTimeout(() => {
      setMounted(true);
    }, 3500);
    return () => {
      clearTimeout(mountingTimeout);
    };
  }, []);

  return (
    <div
      className={clsx(
        mounted
          ? "invisible h-0 w-0"
          : "fixed left-0 top-0 z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-750"
      )}
    >
      <div className="dots">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
    </div>
  );
};
