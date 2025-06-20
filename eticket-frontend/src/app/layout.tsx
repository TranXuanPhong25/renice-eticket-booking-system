import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { Footer } from "@andrew/components/Footer";
import { Header } from "@andrew/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChanTicket",
  description: "Super booking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="description" content="Super booking app" />
        <meta name="keywords" content="booking, tickets, events, concerts" />
      </head>
      <body className="">
        <Header />
        <AntdRegistry>
          <div>{children}</div>
        </AntdRegistry>
        <Footer />
      </body>
    </html>
  );
}
