import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/app/providers/store-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duelovky",
  description: "Zábavné online hry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
