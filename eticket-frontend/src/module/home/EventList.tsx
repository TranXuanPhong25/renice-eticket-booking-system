import { eventTypeMapping } from "@andrew/constants/event.constant";
import { mockupEvents } from "@andrew/mockups/event.mockup";
import { Image, Tag } from "antd";
import Link from "next/link";

const EventItem = (props: any) => {
  const { data } = props;
  const { type } = data;

  const eventConfig = eventTypeMapping[type];
  const { label, tagColor } = eventConfig;

  return (
    <div className="border-none hover:shadow-sm p-4 rounded-2xl">
      <Image src={data.thumbnail} className="rounded-2xl" />
      <Tag color={tagColor}>{label}</Tag>
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex justify-between text-sm text-gray-500">
          {data.location}, {data.startDate}
        </div>
        <Link href={`/${data.slug}-${data.id}`}>
          <div className="text-lg font-bold">{data.name}</div>
        </Link>
      </div>
    </div>
  );
};

export const EventList = () => {
  return (
    <>
      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockupEvents.map((x: any) => (
          <EventItem key={x.id} data={x} />
        ))}
      </div>
    </>
  );
};
