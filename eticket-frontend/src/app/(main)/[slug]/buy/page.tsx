"use client";

import { Container } from "@/components/Container";
import { mockupEventDetail } from "@/mockups/event.mockup";
import { SlotSelection } from "@/module/booking/SlotSelection";
import {
  useGetEventBySlug,
  mapEventToDetailedFormat,
  EventDetails,
} from "@/hooks/useGetEventBySlug";
import { useEffect, useState } from "react";
import { Skeleton, Alert, Result, Button } from "antd";

export default function EventBuyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { data: eventData, isLoading, error } = useGetEventBySlug(slug);
  const [event, setEvent] = useState<EventDetails | null>(null);

  useEffect(() => {
    // If we have data from the API, use it
    if (eventData) {
      const mappedEvent = mapEventToDetailedFormat(eventData);
      setEvent(mappedEvent);
    } else if (!isLoading && !error) {
      // Fallback to mockup data if no API data and not loading/error
      setEvent(mockupEventDetail as unknown as EventDetails);
    }
  }, [eventData, isLoading, error]);

  if (isLoading) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </Container>
    );
  }

  if (error && !event) {
    return (
      <Container>
        <div className="py-12">
          <Result
            status="404"
            title="Không tìm thấy sự kiện"
            subTitle="Xin lỗi, sự kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
            extra={
              <Button type="primary" href="/">
                Trở về trang chủ
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <div className="py-12">
          <Alert
            message="Dữ liệu không khả dụng"
            description="Không thể tải thông tin sự kiện. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        </div>
      </Container>
    );
  }

  return (
    <section>
      <Container>
        <SlotSelection eventData={event as any} />
      </Container>
    </section>
  );
}
