"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Table, Tag, Button, Spin, Alert, Empty, Space, message } from 'antd';
import { Container } from '@/components/Container';
import { useGetUserOrders } from '@/hooks/useGetUserOrders';
import { useAuth } from '@/context/AuthProvider';
import { OrderResponse } from '@/types/order';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, ReloadOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Helper function để format ngày giờ
const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};


const OrdersPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading, error, refetch } = useGetUserOrders(user?.id||'');
  
  // Chuyển hướng đến trang đăng nhập nếu user chưa đăng nhập
  useEffect(() => {
    if (!authLoading && !user) {
      message.warning('Vui lòng đăng nhập để xem đơn hàng của bạn');
      router.push('/auth/login?redirectTo=/order');
    }
  }, [user, authLoading, router]);
  
  // Columns cho table
  const columns: ColumnsType<OrderResponse> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span className="font-medium">{id.substring(0, 8)}...</span>,
    },
    {
      title: 'Thời gian đặt',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (time: number) => formatDateTime(time),
      sorter: (a, b) => a.orderTime - b.orderTime,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span>{amount.toLocaleString()} VNĐ</span>,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => (
        <Tag color={status=='Giao dịch thành công'? 'green' :'red'}>
         {status}
        </Tag>
      ),
      filters: [
        { text: 'Đã thanh toán', value: 'PAID' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Chờ thanh toán', value: 'PENDING' },
        { text: 'Thanh toán thất bại', value: 'FAILED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/order/${record.id}`)}
          >
            Chi tiết
          </Button>
          {(record.orderStatus === 'PENDING' || record.orderStatus === 'FAILED') && (
            <Button
              type="default"
              danger
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => router.push(`/order/${record.id}/retry-payment`)}
            >
              Thanh toán
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  // Hiển thị trạng thái loading
  if (authLoading || isLoading) {
    return (
      <Container>
        <div className="py-12 flex flex-col items-center justify-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</div>
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
            description="Không thể tải danh sách đơn hàng. Vui lòng thử lại sau."
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Title level={2} className="m-0">Đơn hàng của tôi</Title>
          <div className="mt-4 md:mt-0">
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />}
              onClick={() => router.push('/')}
            >
              Khám phá sự kiện
            </Button>
          </div>
        </div>
        
        {orders && orders.length > 0 ? (
          <Card>
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }}
              className="w-full"
            />
          </Card>
        ) : (
          <Card>
            <Empty
              description="Bạn chưa có đơn hàng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                icon={<ShoppingOutlined />}
                onClick={() => router.push('/')}
              >
                Khám phá sự kiện
              </Button>
            </Empty>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default OrdersPage;
