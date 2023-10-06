"use client";

import React, { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";

export const ToastProvider: FC = () => {
  const { theme } = useTheme();

  const toastTheme =
    theme !== "system"
      ? (theme as "dark" | "light")
      : theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      closeOnClick
      theme={toastTheme}
    />
  );
};
