import { Container } from "@/components/Container";
import { SeatMapPreview } from "@/components/event/SeatMapPreview";
import { mockupEventDetail } from "@/mockups/event.mockup";
import CopyLinkButton from "@/components/event/CopyLinkButton";
import { getMaxMinPrice } from "@/utils/event.utils";
import { Button, Image, Tag, Card, Divider, Avatar, Badge, Breadcrumb } from "antd";
import {
  IoCalendar,
  IoLocationOutline,
  IoPricetag,
  IoTimeOutline,
  IoPersonOutline,
  IoTicketOutline,
  IoShareSocialOutline,
  IoHeartOutline,
  IoStarOutline,
  IoHomeOutline,
  IoChevronForwardOutline
} from "react-icons/io5";
import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
const EventBasicInformation = (props: any) => {
  const { data } = props;

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



const SocialLinks = ({ socials }: { socials: any }) => {
  return (
    <div className="flex gap-3 mt-4 ml-10">
      {socials.facebook && (
        <Link href={socials.facebook} target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors">
          <FaFacebook size={24} />
        </Link>
      )}
      {socials.youtube && (
        <Link href={socials.youtube} target="_blank" rel="noopener noreferrer"
          className="text-red-400 hover:text-red-300 transition-colors">
          <FaYoutube size={24} />
        </Link>
      )}
      <CopyLinkButton link={`https://eticket.vn/${socials.slug}`} />
    </div>
  );
};

const ArtistSection = ({ artists, hosts }: { artists: any[], hosts: any[] }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Nghệ sĩ tham gia</h3>

      {/* Artists Grid */}
      <div className="flex justify-around flex-wrap gap-4 mb-8">
        {artists.map((artist, index) => (
          <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="relative">
              <Avatar
                size={64}
                src={artist.image}
                icon={<IoPersonOutline />}
                className="border-2 border-gray-100"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-900">{artist.name}</h4>
              <p className="text-sm text-gray-500 mt-1">Artist</p>
            </div>
          </div>
        ))}
      </div>

      {hosts.length > 0 && (

        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Đơn vị tổ chức</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hosts.map((host, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Avatar size={40} src={host.image} icon={<IoPersonOutline />} />
                <span className="font-medium text-gray-700">{host.name}</span>
              </div>
            ))}
          </div>
        </div>

      )}
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

const StickyBookingBar = ({ slug, priceRange }: { slug: string, priceRange: any }) => {
  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 z-50 lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Giá từ</div>
          <div className="text-lg font-bold text-blue-600">
            {priceRange.minPrice.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
        <Button
          type="primary"
          href={`/${slug}/buy`}
          size="large"
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-none"
          icon={<IoTicketOutline />}
        >
          Mua vé ngay
        </Button>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <Container>
          <div className="py-3">
            <Breadcrumb
              items={[
                {
                  href: '/',
                  title: (
                    <div className="flex items-center gap-1">
                      <IoHomeOutline />
                      <span>Trang chủ</span>
                    </div>
                  ),
                },
                {
                  href: '/events',
                  title: 'Sự kiện',
                },
                {
                  title: mockupEventDetail.name,
                },
              ]}
            />
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute !z-0">
          <Image
            preview={false}
            className="!w-screen object-cover !z-0"
            src={mockupEventDetail.image}
            alt={mockupEventDetail.name}
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
                  src={mockupEventDetail.image}
                  alt={mockupEventDetail.name}
                />
                <div className="absolute top-4 left-4">
                  <Tag color="green" className="text-sm font-semibold">
                    {mockupEventDetail.status}
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
                  <Tag color="blue">{mockupEventDetail.type.toUpperCase()}</Tag>
                  <Tag color="orange">HOT</Tag>
                  <Tag color="red">GIỚI HẠN SỐ LƯỢNG</Tag>
                </div>
                <h1 className="text-2xl lg:text-3xl  font-bold leading-tight mb-4">
                  {mockupEventDetail.name}
                </h1>
              </div>

              <EventBasicInformation
                data={[
                  {
                    icon: <IoCalendar size={24} />,
                    value: `${mockupEventDetail.startedDate} - 20:00`,
                  },
                  {
                    icon: <IoLocationOutline size={24} />,
                    value: mockupEventDetail.address,
                  },
                  {
                    icon: <IoPricetag size={24} />,
                    value: `Từ ${priceRange.minPrice.toLocaleString('vi-VN')} VNĐ đến ${priceRange.maxPrice.toLocaleString('vi-VN')} VNĐ`,
                  },
                  {
                    icon: <IoPersonOutline size={24} />,
                    value: `Tối đa ${mockupEventDetail.maxBuy} vé/người mua`,
                  },
                ]}
              />

              <SocialLinks socials={mockupEventDetail.socials} />
            </div>
          </div>
        </Container>
      </section>

      {/* Content Sections */}

      <Container >
        <div className="py-12 !space-y-8 ">
          {/* Event Description */}
          <Card className="shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Giới thiệu sự kiện</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{mockupEventDetail.description}</p>
              <p>
                Đây là một sự kiện âm nhạc đặc biệt không thể bỏ lỡ trong năm 2025.
                Với sự tham gia của những nghệ sĩ hàng đầu, hệ thống âm thanh và ánh sáng
                chuyên nghiệp, chúng tôi cam kết mang đến cho khán giả một trải nghiệm
                âm nhạc tuyệt vời nhất.
              </p>
              <p>
                Sự kiện sẽ diễn ra tại {mockupEventDetail.address}, một trong những
                địa điểm tổ chức sự kiện uy tín và chuyên nghiệp nhất tại Hà Nội.
              </p>
            </div>
          </Card>

          {/* Seat Map Preview - NEW SECTION */}
          <SeatMapPreview seats={mockupEventDetail.seats} />

          {/* Artists & Hosts */}
          <ArtistSection
            artists={mockupEventDetail.artists}
            hosts={mockupEventDetail.hosts}
          />


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


      {/* Sticky Booking Bar */}
      <StickyBookingBar slug={slug} priceRange={priceRange} />
    </div>
  );
}
