import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { Navbar } from "@/app/components/layout/navbar";
import { StoreProvider } from "@/store/store-provider";
import NextTopLoader from "nextjs-toploader";

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
        <StoreProvider>
          <NextTopLoader
            color="#65a30d"
            crawlSpeed={200}
            easing="ease"
            speed={200}
            height={4}
          />
          <Navbar />
          <div className="m-auto mt-10 w-[max(80%,320px)]">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
