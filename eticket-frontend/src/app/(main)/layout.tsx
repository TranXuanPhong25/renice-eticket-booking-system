import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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