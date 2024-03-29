import React from "react";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/app/providers/store-provider";
import "./globals.css";
import { ToastProvider } from "@/app/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <title>Duelovky | gameplay</title>
        <link rel="shortcut icon" type="image/png" href="/icon.png" />
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
