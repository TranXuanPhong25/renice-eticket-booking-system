import { Container } from "@andrew/components/Container";
import { mockupEventDetail } from "@andrew/mockups/event.mockup";
import { SlotSelection } from "@andrew/module/booking/SlotSelection";

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
