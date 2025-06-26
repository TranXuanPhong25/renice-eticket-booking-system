import { Container } from "@/components/Container";
import dynamic from "next/dynamic";

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
