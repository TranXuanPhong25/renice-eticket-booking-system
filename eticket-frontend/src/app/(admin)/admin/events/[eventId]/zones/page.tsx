"use client";

import React, { use, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Card,
  Typography,
  Popconfirm,
  message,
  Breadcrumb,
  Spin,
  Alert,
  Tooltip,
  Empty
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useGetEventBySlug } from '@/hooks/useGetEventBySlug';
import { useGetEventZones } from '@/hooks/useGetZonesByEvent';
import { useDeleteZone } from '@/hooks/useDeleteZone';

const { Title } = Typography;

export default function ZonesManagement({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const { eventId } = resolvedParams;
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  
  // Get event details
  const { data: event, isLoading: eventLoading, error: eventError } = useGetEventBySlug(eventId);
  
  // Get zones data
  const { data: zones, isLoading: zonesLoading, error: zonesError, refetch: refetchZones } = useGetEventZones(eventId);
  
  // Zone deletion mutation
  const { mutate: deleteZone, isPending: isDeleting } = useDeleteZone();

  const handleDelete = (zoneId: string, zoneName: string) => {
    deleteZone(zoneId, {
      onSuccess: () => {
        refetchZones();
      }
    });
  };

  const columns = [
    {
      title: 'Tên khu vực',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <div 
            style={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              background: record.color,
              border: '1px solid #d9d9d9',
            }} 
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a: any, b: any) => a.capacity - b.capacity,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let text = 'Có sẵn';
        
        if (status === 'out') {
          color = 'red';
          text = 'Hết chỗ';
        } else if (status === 'reserved') {
          color = 'orange';
          text = 'Đã đặt';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Có sẵn', value: 'available' },
        { text: 'Hết chỗ', value: 'out' },
        { text: 'Đã đặt', value: 'reserved' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => router.push(`/admin/events/${eventId}/zones/create?editZone=${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa khu vực"
              description={`Bạn có chắc chắn muốn xóa khu vực "${record.name}" không?`}
              onConfirm={() => handleDelete(record.id, record.name)}
              okText="Có"
              cancelText="Không"
              okButtonProps={{ loading: isDeleting }}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                loading={isDeleting}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filter zones based on search text
  const filteredZones = zones ? zones.filter((zone: any) => 
    zone.name.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  return (
    <>
      <Breadcrumb
        items={[
          { title: 'Admin' },
          { title: 'Quản lý sự kiện', href: '/admin/events' },
          { title: `Khu vực - ${event?.name || eventId}` },
        ]}
        className="mb-4"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          Quản lý khu vực {eventLoading ? '' : `- ${event?.name}`}
        </Title>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/admin/events')}
          >
            Quay lại
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetchZones()}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push(`/admin/events/${eventId}/zones/create`)}
          >
            Tạo khu vực mới
          </Button>
        </Space>
      </div>

      {eventLoading ? (
        <Spin tip="Đang tải thông tin sự kiện..." />
      ) : eventError ? (
        <Alert 
          message="Lỗi tải thông tin sự kiện" 
          description="Không thể tải thông tin sự kiện. Vui lòng thử lại sau." 
          type="error" 
          showIcon 
        />
      ) : (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Tìm kiếm khu vực..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          
          {zonesError && (
            <Alert
              message="Lỗi tải dữ liệu khu vực"
              description="Không thể tải danh sách khu vực. Vui lòng thử lại sau."
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          
          {!zones || zones.length === 0 ? (
            <Empty 
              description="Chưa có khu vực nào được tạo" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push(`/admin/events/${eventId}/zones/create`)}
              >
                Tạo khu vực đầu tiên
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredZones}
              rowKey="id"
              loading={zonesLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} khu vực`,
              }}
            />
          )}
        </Card>
      )}
    </>
  );
}
