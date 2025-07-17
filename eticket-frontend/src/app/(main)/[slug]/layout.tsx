import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết sự kiện | E-Ticket',
  description: 'Thông tin chi tiết về sự kiện, thời gian, địa điểm và giá vé',
};

export default function EventDetailLayout({
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
