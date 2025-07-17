"use client";

import React, { use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Descriptions, Tag, Button, Spin, Alert, Divider, List, Result } from 'antd';
import { Container } from '@/components/Container';
import { useGetOrderById } from '@/hooks/useGetOrderById';
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';


// Helper function để format ngày giờ
const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};



// Define the component as an arrow function component
function OrderDetailPage ({params}:{params:Promise<{id:string}>}) {

  const router = useRouter();
  const { id } = use(params) 
  
  
  const { data: order, isLoading, error } = useGetOrderById(id);
  
  // Xử lý in vé
  const handlePrint = () => {
    window.print();
  };
  
  // Xử lý tải vé
  const handleDownload = () => {
    // Đây là chức năng mẫu, trong thực tế cần API để tải vé
    alert('Chức năng tải vé sẽ được phát triển trong tương lai');
  };
  
  // Xử lý retry payment
  const handleRetryPayment = () => {
    router.push(`/order/${id}/retry-payment`);
  };
  
  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <Container>
        <div className="py-12 flex flex-col items-center justify-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</div>
        </div>
      </Container>
    );
  }
  
  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Container>
        <div className="py-12">
          <Alert
            message="Lỗi"
            description="Không thể tải thông tin đơn hàng. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        </div>
      </Container>
    );
  }
  
  // Hiển thị thông báo nếu đơn hàng không tồn tại
  if (!order) {
    return (
      <Container>
        <div className="py-12">
          <Result
            status="404"
            title="Không tìm thấy đơn hàng"
            subTitle="Đơn hàng bạn đang tìm không tồn tại hoặc đã bị xóa."
            extra={
              <Button type="primary" onClick={() => router.push('/')}>
                Về trang chủ
              </Button>
            }
          />
        </div>
      </Container>
    );
  }
  
  const isPaid = order.orderStatus === 'Giao dịch thành công' ;
  
  return (
    <Container>
      <div className="py-8 print:py-2">
        {/* Header section with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 print:hidden">
          <Typography.Title level={2} className="m-0">Chi tiết đơn hàng</Typography.Title>
          <div className="mt-4 md:mt-0 space-x-2">
            {isPaid ? (
              <>
                <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                  In vé
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                  Tải vé
                </Button>
              </>
            ) : (
              <Button type="primary" danger onClick={handleRetryPayment}>
                Thử lại thanh toán
              </Button>
            )}
            <Button onClick={() => router.push('/')}>
              Về trang chủ
            </Button>
          </div>
        </div>
        
        {/* Order status section */}
        <Card className="mb-6 print:mb-4 print:border-none" >
          <div className="flex items-center">
            {isPaid ? (
              <CheckCircleOutlined className="text-green-500 text-4xl mr-4" />
            ) : (
              <CloseCircleOutlined className="text-red-500 text-4xl mr-4" />
            )}
            <div>
              <Typography.Title level={4} className="m-0">
                {isPaid ? 'Đơn hàng đã thanh toán thành công' : 'Đơn hàng chưa được thanh toán'}
              </Typography.Title>
              <Typography.Text type="secondary">
                {isPaid
                  ? 'Vé điện tử đã được gửi đến email của bạn.'
                  : 'Vui lòng thanh toán để hoàn tất đơn hàng.'}
              </Typography.Text>
            </div>
          </div>
        </Card>
        
        {/* Order information section */}
        <Card title="Thông tin đơn hàng" className="mb-6 print:mb-4 print:border-none" bordered={true}>
          <Descriptions bordered column={{ xs: 1, sm: 2 }} className="print:border-none">
            <Descriptions.Item label="Mã đơn hàng" span={2}>{order.id}</Descriptions.Item>
            <Descriptions.Item label="Họ tên khách hàng">{order.customerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
            <Descriptions.Item label="Thời gian đặt">{formatDateTime(order.orderTime)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={order.orderStatus == 'Giao dịch thành công'? 'green' : 'red'}>
                {order.orderStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <span className="font-bold text-lg">{order.totalAmount.toLocaleString()} VNĐ</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        
        {/* Ticket details section */}
        <Card 
          title="Chi tiết vé" 
          className="mb-6 print:border-none" 
          bordered={true}
          extra={isPaid && <Tag color="green">Đã thanh toán</Tag>}
        >
          {order.tickets && order.tickets.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={order.tickets}
              renderItem={(ticket, index) => (
                <List.Item key={ticket.id} className="flex flex-col md:flex-row md:justify-between py-4">
                  <div className="mb-2 md:mb-0">
                    <div className="font-medium">{ticket.name}</div>
                    <div className="text-sm text-gray-500">ID: {ticket.id}</div>
                    <div className="text-sm text-gray-500">Email: {ticket.email}</div>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="font-medium">{ticket.amount.toLocaleString()} VNĐ</span>
                    <span className="text-sm">Zone ID: {ticket.zoneId}</span>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-4 text-gray-500">
              Không có thông tin vé
            </div>
          )}
        </Card>
        
        {/* Payment instructions if not paid */}
        {!isPaid && (
          <Card title="Hướng dẫn thanh toán" className="mb-6 print:hidden" bordered={true}>
            <Alert
              message="Đơn hàng của bạn chưa được thanh toán"
              description={
                <div>
                  <p>Vui lòng thanh toán để hoàn tất quá trình đặt vé.</p>
                  <p>Bạn có thể thanh toán bằng cách nhấn vào nút "Thử lại thanh toán" ở trên.</p>
                </div>
              }
              type="warning"
              showIcon
            />
            <div className="mt-4 text-center">
              <Button type="primary" danger size="large" onClick={handleRetryPayment}>
                Thử lại thanh toán
              </Button>
            </div>
          </Card>
        )}
        
        {/* Footer for printing */}
        <div className="hidden print:block mt-8 text-center text-gray-500 text-sm">
          <p>Vé điện tử này có giá trị tham dự sự kiện. Vui lòng xuất trình khi check-in.</p>
          <p>Mọi thắc mắc xin liên hệ: support@eticket.example.com</p>
        </div>
      </div>
    </Container>
  );
};

// Export the component as the default export
export default OrderDetailPage;
