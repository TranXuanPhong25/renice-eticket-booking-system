"use client";

import '@/app-init'; // Đảm bảo patch được áp dụng
import { Container } from "@/components/Container";
import { mockupEventDetail } from "@/mockups/event.mockup";
import { SlotSelection } from "@/module/booking/SlotSelection";
import {
  useGetEventById,
  mapEventToDetailedFormat,
  EventDetails,
} from "@/hooks/useGetEventById";
import { useGetEventZones } from "@/hooks/useGetZonesByEvent";
import { use, useEffect, useState } from "react";
import { Skeleton, Alert, Result, Button } from "antd";
import { getIdFromSlug } from "@/utils/lib";

export default function EventBuyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = use(params);
  const { data: eventData, isLoading, error } = useGetEventById(getIdFromSlug(slug));
  // Only fetch zones when we have eventData with an ID
  const { data: zones, isLoading: zonesLoading, error: zonesError } = useGetEventZones(
    eventData?.id?.toString() || ""
  );
  const [event, setEvent] = useState<EventDetails | null>(null);

  useEffect(() => {
    // If we have both event data and zones data from the API, use them
    if (eventData && zones) {
      const mappedEvent = mapEventToDetailedFormat(eventData);
      // Convert zones to seats format for SlotSelection component
      const seatsFromZones = zones.map((zone, index) => ({
        id: zone.id,
        name: zone.name,
        type: zone.name,
        price: zone.price,
        color: zone.color,
        status: zone.status,
        capacity: zone.capacity || 100, // Default capacity if not provided
      }));
      
      setEvent({
        ...mappedEvent,
      });
    } else if (eventData && (!zones || zones.length === 0) && !zonesLoading && !zonesError) {
      // If we have event data but no zones, use empty seats array
      const mappedEvent = mapEventToDetailedFormat(eventData);
      setEvent({
        ...mappedEvent,
        zones: []
      });
    } else if (!isLoading && !error && !zonesLoading && !zonesError && !eventData) {
      // Fallback to mockup data if no API data and not loading/error
      setEvent(mockupEventDetail as unknown as EventDetails);
    }
  }, [eventData, zones, isLoading, error, zonesLoading, zonesError]);



  if (isLoading || (eventData && zonesLoading)) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <div className="mt-4 text-center text-gray-600">
            Đang tải thông tin sự kiện và loại vé...
          </div>
        </div>
      </Container>
    );
  }

  if (error && !eventData) {
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

  if (zonesError) {
    return (
      <Container>
        <div className="py-12">
          <Alert
            message="Lỗi tải thông tin loại vé"
            description="Không thể tải thông tin loại vé cho sự kiện này. Vui lòng thử lại sau."
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => window.location.reload()}>
                Thử lại
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
        <h1 className="text-2xl font-bold mb-4 text-center"><p className="!font-normal">Bạn đang đặt vé cho</p> {event.name}</h1>
        {(!event.zones || event.zones.length === 0) ? (
          <div className="py-12">
            <Alert
              message="Chưa có loại vé"
              description="Sự kiện này chưa có loại vé nào được thiết lập. Vui lòng quay lại sau."
              type="info"
              showIcon
            />
          </div>
        ) : (
          <SlotSelection eventData={event as any} />
        )}
      </Container>
    </section>
  );
}
