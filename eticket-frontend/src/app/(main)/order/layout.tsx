import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi | E-Ticket',
  description: 'Quản lý và xem thông tin đơn hàng vé của bạn',
};

// Layout cho trang order
export default function OrderLayout({ children }: { children: ReactNode }) {
   return (
      <div className="min-h-screen bg-gray-50">
         {children}
      </div>
   );
}
