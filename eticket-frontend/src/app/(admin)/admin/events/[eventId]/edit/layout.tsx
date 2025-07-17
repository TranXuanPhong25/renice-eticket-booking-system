import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa sự kiện | E-Ticket Admin',
  description: 'Chỉnh sửa thông tin sự kiện trên hệ thống E-Ticket',
};

export default function EditEventLayout({
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
