"use client";

import { FC, useEffect, useState } from "react";
import { clsx } from "clsx";
import "./pageloader.css";
import { useDispatch } from "react-redux";
import { Mount } from "@/store/mount/mount-slice";

export const PageLoader: FC = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const mountingTimeout = setTimeout(() => {
      setMounted(true);
      dispatch(Mount());
    }, 3500);
    return () => {
      clearTimeout(mountingTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
