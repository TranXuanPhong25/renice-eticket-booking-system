import { eventTypeMapping } from "@/constants/event.constant";
import { useGetAllEvents, mapEventToUIFormat } from "@/hooks/useGetAllEvents";
import { Image, Tag, Spin, Alert } from "antd";
import Link from "next/link";

const EventItem = (props: any) => {
  const { data } = props;
  // Determine type based on some property or default to "music"
  const type = data.type || "music";

  const eventConfig = eventTypeMapping[type] || eventTypeMapping.music;
  const { label, tagColor } = eventConfig;

  return (
    <div className="border-none hover:shadow-sm p-4 rounded-2xl">
      <Image 
        src={data.image || data.thumbnail} 
        className="rounded-2xl"
        alt={data.title || data.name}
        style={{ height: 200, objectFit: 'cover' }}
        fallback="https://placehold.co/600x400?text=No+Image"
      />
      <Tag color={tagColor}>{label}</Tag>        <div className="flex flex-col gap-1 mt-2">
          <div className="flex justify-between text-sm text-gray-500">
            {data.location}, {data.startedDate || data.startDate}
          </div>
          <Link href={`/${data.slug || data.id}`}>
            <div className="text-lg font-bold">{data.title || data.name}</div>
          </Link>
        </div>
    </div>
  );
};

export interface EventListProps {
  category?: string;
}

export const EventList = ({ category }: EventListProps) => {
  // Use the hook to fetch events
  const { data: events, isLoading, isError, error } = useGetAllEvents();

  // Format events for display
  const formattedEvents = events ? events.map(mapEventToUIFormat) : [];

  // Filter by category if provided
  const filteredEvents = category 
    ? formattedEvents.filter(event => {
        // Try to determine event type - default to matching all if not specified
        const eventType = event.type || "music";
        return eventType === category;
      })
    : formattedEvents;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Đang tải sự kiện ...">
          <div className="p-4 mt-16 text-transparent">Đang tải sự kiện...</div>
        </Spin>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Không thể tải sự kiện"
        description={error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải danh sách sự kiện."}
        type="error"
        showIcon
      />
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventItem key={event.id} data={event} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Không có sự kiện nào trong danh mục này
          </div>
        )}
      </div>
    </>
  );
};
