import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/app/providers/store-provider";
import "./globals.css";
import { ToastProvider } from "@/app/providers/toast-provider";

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
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <StoreProvider>
          {children}
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
