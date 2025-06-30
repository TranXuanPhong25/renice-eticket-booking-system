import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo sự kiện mới | E-Ticket Admin',
  description: 'Tạo sự kiện mới trên hệ thống E-Ticket',
};

export default function CreateEventLayout({
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
