"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="w-20 cursor-pointer rounded-full p-3 text-sm text-lime-600 hover:text-lime-700"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <FontAwesomeIcon size="xl" icon={faMoon} />
      ) : (
        <FontAwesomeIcon size="xl" icon={faSun} />
      )}
    </button>
  );
};
