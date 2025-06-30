"use client";

import { Container } from "@/components/Container";
import { SeatMapPreview } from "@/components/event/SeatMapPreview";
import CopyLinkButton from "@/components/event/CopyLinkButton";
import { getMaxMinPrice } from "@/utils/event.utils";
import { Button, Image, Tag, Card, Divider, Avatar, Badge, Breadcrumb, Skeleton, Alert, Result } from "antd";
import {
  IoCalendar,
  IoLocationOutline,
  IoPricetag,
  IoTimeOutline,
  IoPersonOutline,
  IoTicketOutline,

} from "react-icons/io5";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useGetEventById, mapEventToDetailedFormat, EventDetails } from "@/hooks/useGetEventById";
import { useEffect, useState } from "react";
import { mockupEventDetail } from "@/mockups/event.mockup";
import { use } from 'react';
import { getIdFromSlug } from "@/utils/lib";
import { eventTypeMapping } from "@/constants/event.constant";

const EventBasicInformation = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item: any, index: number) => (
        <div key={index} className="flex gap-3 items-center">
          <span className="text-blue-400 mt-1">{item.icon}</span>
          <div className="text-gray-100">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

const EventCountdown = ({ date }: { date: string }) => {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 ">
      <h4 className="font-semibold text-gray-800 mb-2">Thời gian còn lại</h4>
      <div className="flex gap-4 text-center">
        <div className="bg-white rounded-lg p-2 min-w-[60px]">
          <div className="text-2xl font-bold text-red-500">15</div>
          <div className="text-xs text-gray-600">Ngày</div>
        </div>
        <div className="bg-white rounded-lg p-2 min-w-[60px]">
          <div className="text-2xl font-bold text-red-500">08</div>
          <div className="text-xs text-gray-600">Giờ</div>
        </div>
        <div className="bg-white rounded-lg p-2 min-w-[60px]">
          <div className="text-2xl font-bold text-red-500">23</div>
          <div className="text-xs text-gray-600">Phút</div>
        </div>
      </div>
    </div>
  );
};

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const { data: eventData, isLoading, error } = useGetEventById(getIdFromSlug(slug));
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 0 });

  useEffect(() => {
    // If we have data from the API, use it
    if (eventData) {
      const mappedEvent = mapEventToDetailedFormat(eventData);
      setEvent(mappedEvent);
      
      // Calculate price range
      if (mappedEvent.zones && mappedEvent.zones.length > 0) {
        setPriceRange(getMaxMinPrice(mappedEvent.zones));
      } else if (mappedEvent.price) {
        // If no seats but has a price
        setPriceRange({ minPrice: mappedEvent.price, maxPrice: mappedEvent.price });
      }
    } else if (!isLoading && !error) {
      // Fallback to mockup data if no API data and not loading/error
      setEvent(mockupEventDetail as unknown as EventDetails);
      setPriceRange(getMaxMinPrice(mockupEventDetail.seats));
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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute !z-0">
          <Image
            preview={false}
            className="!w-screen object-cover !z-0"
            src={event.image}
            alt={event.name}
            style={{ filter: 'blur(10px) brightness(0.5)', transform: 'scale(1.2)' }}
          />
        </div>
        {/* Content */}
        <Container className="relative !z-20">
          <div className="grid lg:grid-cols-2 gap-8 py-8 lg:py-12 items-center">
            {/* Event Image */}
            <div className="space-y-4">
              <div className="relative">
                <Image
                  preview={false}
                  className="rounded-2xl overflow-hidden shadow-2xl w-full"
                  src={event.image}
                  alt={event.name}
                />
                <div className="absolute top-4 left-4">
                  <Tag color="green" className="text-sm font-semibold">
                    {event.status || 'OPEN'}
                  </Tag>
                </div>
              </div>

              <Button
                type="primary"
                href={`/${slug}/buy`}
                className="w-full !h-14 text-base lg:!text-lg font-semibold "
                icon={<IoTicketOutline size={20} />}
              >
                MUA VÉ NGAY - Từ {priceRange.minPrice.toLocaleString('vi-VN')} VNĐ
              </Button>
            </div>

            {/* Event Details */}
            <div className="text-white space-y-6 z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {event.type && eventTypeMapping[event.type] ? (
                    <Tag color={eventTypeMapping[event.type].tagColor}>
                      {eventTypeMapping[event.type].label}
                    </Tag>
                  ) : (
                    <Tag color="blue">{(event.type || 'MUSIC').toUpperCase()}</Tag>
                  )}
                  <Tag color="orange">HOT</Tag>
                  <Tag color="red">GIỚI HẠN SỐ LƯỢNG</Tag>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-4">
                  {event.name}
                </h1>
              </div>

              <EventBasicInformation
                data={[
                  {
                    icon: <IoCalendar size={24} />,
                    value: `${new Date(event.startedDate).toLocaleDateString() || 'TBA'} - ${event.startedTime || '20:00'}`,
                  },
                  {
                    icon: <IoLocationOutline size={24} />,
                    value: event.address || event.address || 'TBA',
                  },
                  {
                    icon: <IoPricetag size={24} />,
                    value: `Từ ${priceRange.minPrice.toLocaleString('vi-VN')} VNĐ đến ${priceRange.maxPrice.toLocaleString('vi-VN')} VNĐ`,
                  },
                  {
                    icon: <IoPersonOutline size={24} />,
                    value: `Tối đa ${event.maxBuy || 4} vé/người mua`,
                  },
                ]}
              />

            </div>
          </div>
        </Container>
      </section>

      {/* Content Sections */}
      <Container>
        <div className="py-12 !space-y-8">
          {/* Event Description */}
          <Card className="shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Giới thiệu sự kiện</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{event.description}</p>
            </div>
          </Card>
          
          {/* Seat Map Preview - if available */}
        
            <SeatMapPreview event={event} />
          

          {/* Important Information */}
          <Card className="bg-yellow-50 border-yellow-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <IoTimeOutline className="text-yellow-600" />
              Thông tin quan trọng
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>Vé đã mua không được hoàn trả, đổi trả trừ trường hợp sự kiện bị hủy</p>
              <p>Khán giả vui lòng có mặt trước 30 phút để làm thủ tục vào cổng</p>
              <p>Không được mang thức ăn, đồ uống từ bên ngoài vào venue</p>
              <p>Trẻ em dưới 6 tuổi không được vào xem</p>
              <p>Nghiêm cấm quay phim, chụp ảnh trong suốt chương trình</p>
            </div>
          </Card>
        </div>
      </Container>

    </div>
  );
}
