import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết đơn hàng | E-Ticket',
  description: 'Xem chi tiết đơn hàng và thông tin vé của bạn',
};

export default function OrderDetailLayout({
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
