import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { Footer } from "@andrew/components/Footer";
import { Header } from "@andrew/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "eTicketBooking - Event Booking Platform",
  description: "Super booking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
