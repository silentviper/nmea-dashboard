'use client';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import BootstrapClient from '../components/BootstrapClient.js';
import './mainComponent.scss'


const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(t){function e(){var e=this||self;e.globalThis=e,delete t.prototype._T_}"object"!=typeof globalThis&&(this?e():(t.defineProperty(t.prototype,"_T_",{configurable:!0,get:e}),_T_))}(Object);`,
        }}
      />
      </head>
      <body  className={roboto.className}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
