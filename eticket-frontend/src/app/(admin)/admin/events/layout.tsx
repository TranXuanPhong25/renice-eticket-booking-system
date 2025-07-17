import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý sự kiện | E-Ticket Admin',
  description: 'Quản lý tất cả các sự kiện trên hệ thống E-Ticket',
};

export default function EventsLayout({
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
