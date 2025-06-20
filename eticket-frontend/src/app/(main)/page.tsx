import { Container } from "@/components/Container";
import { EventList } from "@/module/home/EventList";
import { EventSlider } from "@/module/home/EventSlider";

export default function Home() {
  return (
    <Container>
      <div className="px-5">
        <EventSlider />

        <h2 className="text-2xl font-bold mb-4">Sự kiện</h2>
        <EventList />
      </div>
    </Container>
  );
}
