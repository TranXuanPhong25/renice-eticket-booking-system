import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import "./globals.css";
import { AuthProvider } from '../context/AuthProvider';

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
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="description" content="Super booking app" />
        <meta name="keywords" content="booking, tickets, events, concerts" />
      </head>
      <body className="">
        <AuthProvider>
          <ReactQueryProvider>
            <AntdRegistry>
              <div>{children}</div>
            </AntdRegistry>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
