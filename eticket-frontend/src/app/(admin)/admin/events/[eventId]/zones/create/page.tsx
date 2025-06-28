"use client";

import React, { use, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Card,
  message,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Breadcrumb,
  Spin,
  Alert,
  ColorPicker,
  Table,
  Tag,
  Tooltip,
  Empty,
  Popconfirm,
  Select
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateZone } from '@/hooks/useCreateZone';
import { useGetEventById } from '@/hooks/useGetEventById';
import { ZoneFormData } from '@/types/zone';
import { useGetEventZones } from '@/hooks/useGetZonesByEvent';
import { useDeleteZone } from '@/hooks/useDeleteZone';
import { useUpdateZone } from '@/hooks/useUpdateZone';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CreateZone({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const { eventId } = resolvedParams;
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedColor, setSelectedColor] = useState<string>('#FF97C1');
  
  // State để track editing mode
  const [editingZone, setEditingZone] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Get event details
  const { data: event, isLoading: eventLoading, error: eventError } = useGetEventById(eventId);
  
  // Get existing zones for this event
  const { data: zones, isLoading: zonesLoading, error: zonesError, refetch: refetchZones } = useGetEventZones(eventId);
  
  // Zone creation mutation
  const { mutate: createZone, isPending } = useCreateZone();
  
  // Zone deletion mutation
  const { mutate: deleteZone, isPending: isDeleting } = useDeleteZone();
  
  // Zone update mutation
  const { mutate: updateZone, isPending: isUpdating } = useUpdateZone();

  // Check for edit zone from query params
  useEffect(() => {
    const editZoneId = searchParams.get('editZone');
    if (editZoneId && zones) {
      const zoneToEdit = zones.find(zone => zone.id === editZoneId);
      if (zoneToEdit) {
        handleEditZone(zoneToEdit);
      }
    }
  }, [searchParams, zones]);

  // Handle form submission
  const onFinish = (values: any) => {
    if (isEditMode && editingZone) {
      // Update existing zone
      const zoneData = {
        name: values.name,
        price: values.price,
        color: values.color || selectedColor,
        capacity: values.capacity,
        status: values.status || 'available'
      };

      updateZone({ zoneId: editingZone.id, zoneData }, {
        onSuccess: () => {
          message.success('Cập nhật khu vực thành công!');
          refetchZones();
          // Reset form và exit edit mode
          form.resetFields();
          setEditingZone(null);
          setIsEditMode(false);
          setSelectedColor('#FF97C1');
        },
        onError: (error) => {
          message.error(`Lỗi khi cập nhật khu vực: ${error.message}`);
        }
      });
    } else {
      // Create new zone
      const zoneData: ZoneFormData = {
        eventId,
        name: values.name,
        price: values.price,
        color: values.color || selectedColor,
        status: values.status || 'available',
        capacity: values.capacity || 100
      };

      createZone(zoneData, {
        onSuccess: () => {
          message.success('Tạo khu vực thành công!');
          refetchZones();
          form.resetFields();
          setSelectedColor('#FF97C1');
        },
        onError: (error) => {
          message.error(`Lỗi khi tạo khu vực: ${error.message}`);
        }
      });
    }
  };

  // Apply predefined templates
  const applyTemplate = (template: string) => {
    switch (template) {
      case 'vip':
        form.setFieldsValue({ name: 'VIP', price: 4900000, capacity: 50, color: '#FF97C1' });
        setSelectedColor('#FF97C1');
        break;
      case 'zoneA':
        form.setFieldsValue({ name: 'Zone A', price: 3900000, capacity: 100, color: '#FFB47D' });
        setSelectedColor('#FFB47D');
        break;
      case 'zoneB':
        form.setFieldsValue({ name: 'Zone B', price: 2900000, capacity: 150, color: '#9AD0C2' });
        setSelectedColor('#9AD0C2');
        break;
      case 'zoneC':
        form.setFieldsValue({ name: 'Zone C', price: 1900000, capacity: 200, color: '#A7A3EA' });
        setSelectedColor('#A7A3EA');
        break;
    }
  };

  // Handle zone deletion
  const handleDeleteZone = (zoneId: string, zoneName: string) => {
    deleteZone(zoneId, {
      onSuccess: () => {
        refetchZones();
      }
    });
  };

  // Handle edit zone - set form values and enter edit mode
  const handleEditZone = (zone: any) => {
    setEditingZone(zone);
    setIsEditMode(true);
    setSelectedColor(zone.color);
    
    form.setFieldsValue({
      name: zone.name,
      price: zone.price,
      color: zone.color,
      capacity: zone.capacity,
      status: zone.status,
    });
    
    // Scroll to the form
    window.scrollTo({
      top: document.getElementById('zone-form')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingZone(null);
    setIsEditMode(false);
    form.resetFields();
    setSelectedColor('#FF97C1');
  };

  return (
    <>
      <Breadcrumb
        items={[
          { title: 'Admin' },
          { title: 'Quản lý sự kiện', href: '/admin/events' },
          { title: `Tạo khu vực cho sự kiện ${event?.name || eventId}` },
        ]}
        className="mb-4"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Tạo khu vực cho sự kiện</Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/events')}
        >
          Quay lại danh sách
        </Button>
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
        <>
          <Row className="mb-5">
            <Col span={24}>
              <Card title="Các khu vực đã tạo" extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => {
                    // Scroll to the form
                    window.scrollTo({
                      top: document.getElementById('zone-form')?.offsetTop || 0,
                      behavior: 'smooth'
                    });
                  }}
                >
                  Tạo khu vực mới
                </Button>
              }>
                {zonesLoading ? (
                  <Spin tip="Đang tải dữ liệu khu vực..." />
                ) : zonesError ? (
                  <Alert
                    message="Lỗi tải dữ liệu khu vực"
                    description="Không thể tải danh sách khu vực. Vui lòng thử lại sau."
                    type="error"
                    showIcon
                  />
                ) : !zones || zones.length === 0 ? (
                  <Empty 
                    description="Chưa có khu vực nào được tạo" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                ) : (
                  <Table 
                    dataSource={zones} 
                    rowKey="id"
                    columns={[
                      {
                        title: 'Tên khu vực',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record) => (
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
                        render: (price) => `${price.toLocaleString()} VNĐ`,
                      },
                      {
                        title: 'Sức chứa',
                        dataIndex: 'capacity',
                        key: 'capacity',
                      },
                      {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status) => {
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
                      },
                      {
                        title: 'Thao tác',
                        key: 'action',
                        render: (_, record) => (
                          <Space size="small">
                            <Tooltip title="Chỉnh sửa">
                              <Button 
                                type="text" 
                                icon={<EditOutlined />} 
                                size="small" 
                                onClick={() => handleEditZone(record)}
                              />
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <Popconfirm
                                title="Xóa khu vực"
                                description={`Bạn có chắc chắn muốn xóa khu vực "${record.name}" không?`}
                                onConfirm={() => handleDeleteZone(record.id, record.name)}
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
                    ]}
                    pagination={false}
                  />
                )}
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={14} offset={5}>
              <Card 
                title={isEditMode ? `Chỉnh sửa khu vực: ${editingZone?.name}` : "Thông tin khu vực"} 
                id="zone-form"
                extra={isEditMode ? (
                  <Button onClick={handleCancelEdit} size="small">
                    Hủy chỉnh sửa
                  </Button>
                ) : null}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{ color: selectedColor }}
                >
                  <Alert
                    message={isEditMode ? "Chỉnh sửa khu vực" : "Tạo khu vực đơn giản"}
                    description={isEditMode ? "Cập nhật thông tin khu vực đã chọn." : "Nhập tên khu vực, chọn màu sắc và nhập giá vé cùng sức chứa."}
                    type={isEditMode ? "warning" : "info"}
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  
                  <Form.Item
                    name="name"
                    label="Tên khu vực"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khu vực!' }]}
                  >
                    <Input 
                      placeholder="VIP, Zone A, Zone B..." 
                      onChange={(e) => {
                        const name = e.target.value;
                        // Automatically set color based on name if user hasn't manually picked a color
                        if (name) {
                          let newColor = selectedColor;
                          if (name.toLowerCase().includes('vip')) newColor = '#FF97C1';
                          else if (name.toLowerCase().includes('a')) newColor = '#FFB47D';
                          else if (name.toLowerCase().includes('b')) newColor = '#9AD0C2';
                          else if (name.toLowerCase().includes('c')) newColor = '#A7A3EA';
                          
                          if (newColor !== selectedColor) {
                            setSelectedColor(newColor);
                            form.setFieldsValue({ color: newColor });
                          }
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="color"
                    label="Màu sắc khu vực"
                    rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <ColorPicker
                        defaultValue={selectedColor}
                        value={selectedColor}
                        onChange={(color) => {
                          const hexColor = color.toHexString();
                          setSelectedColor(hexColor);
                          form.setFieldsValue({ color: hexColor });
                        }}
                        presets={[
                          {
                            label: 'Màu khu vực',
                            colors: [
                              '#FF97C1', // VIP
                              '#FFB47D', // Zone A
                              '#9AD0C2', // Zone B
                              '#A7A3EA', // Zone C
                              '#ff4d4f', // Red
                              '#faad14', // Yellow
                              '#52c41a', // Green
                              '#1890ff', // Blue
                              '#722ed1', // Purple
                              '#eb2f96', // Pink
                            ],
                          },
                        ]}
                      />
                      <div 
                        style={{ 
                          width: 80, 
                          height: 30, 
                          background: selectedColor, 
                          border: '1px solid #d9d9d9',
                          borderRadius: 4, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Text style={{ color: selectedColor === '#ffffff' ? '#000' : '#fff' }}>{selectedColor}</Text>
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="price"
                    label="Giá vé (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
                  >
                    <InputNumber
                      min={0}
                      step={10000}
                      style={{ width: '100%' }}
                      placeholder="Nhập giá vé"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="capacity"
                    label="Sức chứa (số chỗ ngồi)"
                    rules={[{ required: true, message: 'Vui lòng nhập sức chứa khu vực!' }]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      placeholder="Nhập số lượng chỗ ngồi"
                    />
                  </Form.Item>

                  <Form.Item
                    name="status"
                    label="Trạng thái"
                    initialValue="available"
                  >
                    <Select placeholder="Chọn trạng thái khu vực">
                      <Option value="available">Có sẵn</Option>
                      <Option value="out">Hết chỗ</Option>
                      <Option value="reserved">Đã đặt</Option>
                    </Select>
                  </Form.Item>

                  <Divider>Mẫu khu vực</Divider>

                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Chọn mẫu để áp dụng nhanh:</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      <Button size="small" onClick={() => applyTemplate('vip')}>VIP - 4,900,000đ</Button>
                      <Button size="small" onClick={() => applyTemplate('zoneA')}>Zone A - 3,900,000đ</Button>
                      <Button size="small" onClick={() => applyTemplate('zoneB')}>Zone B - 2,900,000đ</Button>
                      <Button size="small" onClick={() => applyTemplate('zoneC')}>Zone C - 1,900,000đ</Button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Divider orientation="left">Xem trước</Divider>
                    <div style={{ 
                      background: '#f5f5f5', 
                      padding: 16, 
                      borderRadius: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ 
                          width: 120, 
                          height: 30, 
                          background: '#8c8c8c', 
                          textAlign: 'center',
                          borderRadius: 4,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20
                        }}>
                          SÂN KHẤU
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: 16,
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: 100,
                          height: 60,
                          background: selectedColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
                          fontWeight: 'bold',
                          color: selectedColor === '#ffffff' ? '#000' : '#fff'
                        }}>
                          {form.getFieldValue('name') || 'Khu vực'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isPending || isUpdating} 
                        icon={<SaveOutlined />}
                      >
                        {isEditMode ? 'Cập nhật khu vực' : 'Lưu khu vực'}
                      </Button>
                      {isEditMode && (
                        <Button onClick={handleCancelEdit}>
                          Hủy
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
