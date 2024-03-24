"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";

export const Footer: FC = () => {
  const pathname = usePathname();

  if (pathname === "/main/chat" || pathname === "/chat") return null;

  return (
    <div className="mt-3 w-full py-4">
      <hr className="mx-5 mb-3 border-gray-500" />
      <p className="text-center">&copy; 2024 - Roman Tarnai</p>
    </div>
  );
};
