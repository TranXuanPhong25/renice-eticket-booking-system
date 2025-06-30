import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý khu vực | E-Ticket Admin',
  description: 'Quản lý các khu vực và giá vé cho sự kiện',
};

export default function ZonesLayout({
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
