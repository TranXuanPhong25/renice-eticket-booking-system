import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Ticket - Hệ thống đặt vé sự kiện trực tuyến',
  description: 'Đặt vé sự kiện trực tuyến dễ dàng, nhanh chóng và an toàn',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='my-8 min-h-screen'>{children}</main>
      <Footer />
    </>
  );
}