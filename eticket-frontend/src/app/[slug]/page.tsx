import { Container } from "@andrew/components/Container";
import { mockupEventDetail } from "@andrew/mockups/event.mockup";
import { getMaxMinPrice } from "@andrew/utils/event.utils";
import { Button, Image, Tag } from "antd";
import { IoCalendar, IoLocationOutline, IoPricetag } from "react-icons/io5";

const EventBasicInformation = (props: any) => {
  const { data } = props;

  return (
    <div className="flex flex-col gap-4">
      {data.map((item: any) => (
        <div className="flex gap-2">
          <span>{item.icon}</span>
          <div className="text-lg">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const priceRange = getMaxMinPrice(mockupEventDetail.seats);

  return (
    <section>
      <div className="bg-gray-700 w-full">
        <Container>
          <div className="grid grid-cols-2 gap-5 py-10">
            <div>
              <div>
                <Image
                  preview={false}
                  className="rounded-2xl overflow-hidden"
                  src={mockupEventDetail.image}
                />
              </div>
              <div>
                <Button type="primary" href="/something/buy" size="large" className="w-full mt-1">
                  MUA VÉ NGAY
                </Button>
              </div>
            </div>
            <div className="text-white">
              <Tag>{mockupEventDetail.status}</Tag>
              <h2 className="text-2xl font-semibold mt-2 mb-5">
                {mockupEventDetail.name}
              </h2>
              <EventBasicInformation
                data={[
                  {
                    icon: <IoCalendar size={28} />,
                    value: mockupEventDetail.startedDate,
                  },
                  {
                    icon: <IoLocationOutline size={28} />,
                    value: mockupEventDetail.address,
                  },
                  {
                    icon: <IoPricetag size={28} />,
                    value: `Từ ${priceRange.minPrice} VNĐ đến ${priceRange.maxPrice} VNĐ`,
                  },
                ]}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-4">{mockupEventDetail.description}</div>
      </Container>
    </section>
  );
}
