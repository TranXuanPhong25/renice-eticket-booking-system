import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mua vé | E-Ticket',
  description: 'Đặt và mua vé sự kiện trực tuyến',
};

export default function BuyTicketLayout({
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
