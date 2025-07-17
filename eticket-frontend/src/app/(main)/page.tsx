import { Container } from "@/components/Container";
import dynamic from "next/dynamic";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ | E-Ticket - Đặt vé sự kiện trực tuyến',
  description: 'Khám phá và đặt vé các sự kiện hấp dẫn trên E-Ticket',
};

// Use dynamic import with no SSR for the client component
const EventsSection = dynamic(
  () => import("@/module/home/EventsSection")

);

export default function Home() {
  return (
    <Container>
      <div className="px-5">
        <EventsSection />
      </div>
    </Container>
  );
}
