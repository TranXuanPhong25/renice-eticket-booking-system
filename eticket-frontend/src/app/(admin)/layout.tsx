import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang quản trị | E-Ticket Admin',
  description: 'Hệ thống quản trị E-Ticket - Quản lý sự kiện và bán vé trực tuyến',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
