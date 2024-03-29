import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Navbar } from "@/app/components/layout/navbar/navbar";
import { StoreProvider } from "@/app/providers/store-provider";
import NextTopLoader from "nextjs-toploader";
import { ToastProvider } from "@/app/providers/toast-provider";
import { PageLoader } from "@/app/components/page-loader/page-loader";
import { Footer } from "@/app/components/footer";
import { clsx } from "clsx";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <title>Duelovky</title>
        <meta
          name="description"
          content="Online hry pro dva hráče. Horolezci, Prší, Slovní fotbal. Portál který spojuje hráče a hráčky po celé republice"
        />
        <link rel="shortcut icon" type="image/png" href="/icon.png" />
        <link rel="canonical" href="https://duelovky.net/main" />
      </head>
      <body className={clsx(inter.className, "overflow-auto")}>
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
