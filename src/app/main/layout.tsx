import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { Navbar } from "@/app/components/layout/navbar/navbar";
import { StoreProvider } from "@/app/providers/store-provider";
import NextTopLoader from "nextjs-toploader";
import { ToastProvider } from "@/app/providers/toast-provider";
import { PageLoader } from "@/app/components/page-loader/page-loader";
import { Footer } from "@/app/components/footer";

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
          <PageLoader />
          <div className="layout-container">
            <Navbar />
            {children}
            <Footer />
          </div>
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
