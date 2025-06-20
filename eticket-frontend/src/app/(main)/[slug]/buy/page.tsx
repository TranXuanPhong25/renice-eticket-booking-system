import { Container } from "@/components/Container";
import { mockupEventDetail } from "@/mockups/event.mockup";
import { SlotSelection } from "@/module/booking/SlotSelection";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section>
      <Container>
        <SlotSelection eventData={mockupEventDetail} />
      </Container>
    </section>
  );
}
