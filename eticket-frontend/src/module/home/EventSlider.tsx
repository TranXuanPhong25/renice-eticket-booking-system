import { useGetAllEvents, mapEventToUIFormat } from "@/hooks/useGetAllEvents";
import { Carousel, Spin, Alert } from "antd";
import Link from "next/link";

export const EventSlider = () => {
  // Use the hook to fetch events
  const { data: events, isLoading, isError, error } = useGetAllEvents();

  // Format events for display and take only the first 3 for the slider
  const featuredEvents = events ? events.slice(0, 3).map(mapEventToUIFormat) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[250px]">
        <Spin size="large" tip="Đang tải sự kiện nổi bật..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Không thể tải sự kiện nổi bật"
        description={error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải sự kiện nổi bật."}
        type="error"
        showIcon
        className="mb-5"
      />
    );
  }

  return (
    <>
      <Carousel autoplay className="mb-5">
        {featuredEvents.map(event => (
          <div key={event.id} className="h-[250px]">
            <Link href={`/${event.id}`}>
              <img
                className="object-cover w-full h-full"
                src={event.image || "https://placehold.co/1600x900?text=No+Image"}
                alt={event.title}
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </>
  );
};
