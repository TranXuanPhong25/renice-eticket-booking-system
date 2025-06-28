"use client";

import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Card, Typography, Popconfirm, message, Breadcrumb, Spin, Alert } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetAllEvents, mapEventToUIFormat } from '@/hooks/useGetAllEvents';

const { Title } = Typography;

// Không còn cần MOCK_EVENTS nữa vì chúng ta sẽ lấy dữ liệu từ API

export default function EventsManagement() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  
  // Sử dụng hook để lấy dữ liệu sự kiện
  const { data: events, isLoading, isError, error, refetch } = useGetAllEvents();
  
  const handleDelete = (id: string) => {
    // Xử lý xóa sự kiện (sẽ thêm API call thực tế sau)
    message.success(`Đã xóa sự kiện ID: ${id}`);
    // Refetch sau khi xóa
    refetch();
  };
  
  const statusColors = {
    published: 'green',
    draft: 'blue',
    cancelled: 'red',
  };
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Link href={`/admin/events/${record.id}`} style={{ color: '#1890ff' }}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Ngày sự kiện',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return formattedDate;
      },
    },
    {
      title: 'Địa điểm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors] || 'default'}>
          {status === 'published' ? 'Đã xuất bản' : status === 'draft' ? 'Bản nháp' : 'Đã hủy'}
        </Tag>
      ),
    },
    {
      title: 'Vé đã bán',
      key: 'tickets',
      render: (record: any) => (
        <span>
          {record.tickets_sold} / {record.total_tickets}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="primary" 
            ghost 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => router.push(`/${record.id}`)}
          >
            Xem
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => router.push(`/admin/events/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Button 
            type="primary" 
            style={{ background: '#52c41a' }}
            icon={<PlusOutlined />} 
            size="small"
            onClick={() => router.push(`/admin/events/${record.id}/zones`)}
          >
            Quản lý Khu vực
          </Button>
          <Popconfirm
            title="Xóa sự kiện"
            description="Bạn có chắc chắn muốn xóa sự kiện này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Transform API data to UI format
  const formattedEvents = events ? events.map(mapEventToUIFormat) : [];
  
  // Filter events based on search text
  const filteredEvents = formattedEvents.filter(event => 
    event.title.toLowerCase().includes(searchText.toLowerCase()) ||
    event.address.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Breadcrumb
        items={[
          { title: 'Admin' },
          { title: 'Quản lý sự kiện' },
        ]}
        className="mb-4"
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý sự kiện</Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/admin/events/create')}
          >
            Tạo sự kiện mới
          </Button>
        </Space>
      </div>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm sự kiện..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
        
        {isError && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải danh sách sự kiện.'}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sự kiện`,
          }}
        />
      </Card>
    </>
  );
}
