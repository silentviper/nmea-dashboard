'use client';
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import BootstrapClient from '../components/BootstrapClient.js';
import './mainComponent.scss'

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(t){function e(){var e=this||self;e.globalThis=e,delete t.prototype._T_}"object"!=typeof globalThis&&(this?e():(t.defineProperty(t.prototype,"_T_",{configurable:!0,get:e}),_T_))}(Object);`,
        }}
      />;
      <body>
        {children}

        <BootstrapClient />
      </body>
    </html>
  );
}
