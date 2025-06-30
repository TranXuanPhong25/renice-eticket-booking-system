"use client";

import React, { useState, useEffect } from 'react';
import {
   Form,
   Input,
   Button,
   DatePicker,
   TimePicker,
   InputNumber,
   Select,
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
   Tag
} from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useGetEventById } from '@/hooks/useGetEventById';
import { useUpdateEvent, EventUpdateFormData } from '@/hooks/useUpdateEvent';
import { handleApiError } from '@/utils/apiErrorHandler';
import { eventTypeMapping } from '@/constants/event.constant';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function EditEvent({ params }: { params: { eventId: string } }) {
   const { eventId } = params;
   const [form] = Form.useForm();
   const router = useRouter();
   const [imagePreviewUrl, setImagePreviewUrl] = useState('');
   const [imageError, setImageError] = useState(false);
   const [zoneMapPreviewUrl, setZoneMapPreviewUrl] = useState('');
   const [zoneMapError, setZoneMapError] = useState(false);

   // Fetch event data
   const { data: event, isLoading: isLoadingEvent, error: eventError } = useGetEventById(eventId);

   // Update mutation
   const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent(eventId);

   // Watch form fields for image previews
   const imageUrl = Form.useWatch('image', form);
   const zoneMapUrl = Form.useWatch('zoneMap', form);

   useEffect(() => {
      if (event) {
         // Format dates for form
         const startDate = dayjs(Number(event.startedDate) * 1000);
         const endDate = dayjs(Number(event.endedDate) * 1000);
         const startTime = dayjs(event.startedTime, 'HH:mm');
         const endTime = dayjs(event.endedTime, 'HH:mm');

         // Set form values
         form.setFieldsValue({
            name: event.name,
            description: event.description,
            image: event.image,
            address: event.address,
            type: event.type || 'music',
            dateRange: [startDate, endDate],
            time: [startTime, endTime],
            maxBuy: event.maxBuy,
            price: event.price,
            zoneMap: event.zoneMap,
         });

         // Set preview images
         if (event.image) {
            setImagePreviewUrl(event.image);
         }
         if (event.zoneMap) {
            setZoneMapPreviewUrl(event.zoneMap);
         }
      }
   }, [event, form]);

   useEffect(() => {
      // Preview image when URL changes
      const timer = setTimeout(() => {
         const url = form.getFieldValue('image');
         if (url) {
            setImagePreviewUrl(url);
            setImageError(false);
         }
      }, 500);

      return () => clearTimeout(timer);
   }, [imageUrl, form]);

   useEffect(() => {
      // Preview zone map when URL changes
      const timer = setTimeout(() => {
         const url = form.getFieldValue('zoneMap');
         if (url) {
            setZoneMapPreviewUrl(url);
            setZoneMapError(false);
         }
      }, 500);

      return () => clearTimeout(timer);
   }, [zoneMapUrl, form]);

   const onFinish = async (values: any) => {
      try {
         // Format form values for the API
         const formattedValues: EventUpdateFormData = {
            name: values.name,
            description: values.description,
            image: values.image,
            address: values.address,
            maxBuy: values.maxBuy,
            price: values.price,
            startedDate: values.dateRange[0].unix(),
            endedDate: values.dateRange[1].unix(),
            startedTime: values.time[0].format('HH:mm'),
            endedTime: values.time[1].format('HH:mm'),
            zoneMap: values.zoneMap,
            type: values.type,
         };

         // Call API to update the event
         updateEvent(formattedValues, {
            onSuccess: () => {
               message.success('Cập nhật sự kiện thành công!');
               router.push('/admin/events');
            },
            onError: (error) => {
               const errorMessage = handleApiError(error);
               message.error(`Lỗi: ${errorMessage}`);
            }
         });
      } catch (error) {
         console.error('Error processing form:', error);
         message.error('Có lỗi xảy ra khi xử lý form!');
      }
   };

   if (isLoadingEvent) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <Spin size="large" tip="Đang tải thông tin sự kiện..." />
         </div>
      );
   }

   if (eventError) {
      return (
         <Alert
            message="Lỗi"
            description="Không thể tải thông tin sự kiện. Vui lòng thử lại sau."
            type="error"
            showIcon
         />
      );
   }

   const validateMessages = {
      required: '${label} là trường bắt buộc!',
      types: {
         email: '${label} không đúng định dạng email!',
         number: '${label} không đúng định dạng số!',
      },
      number: {
         range: '${label} phải nằm trong khoảng từ ${min} đến ${max}',
      },
   };

   return (
      <>
         <Breadcrumb
            items={[
               { title: 'Admin' },
               { title: 'Quản lý sự kiện', href: '/admin/events' },
               { title: 'Chỉnh sửa sự kiện' },
            ]}
            className="mb-4"
         />

         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>Chỉnh sửa sự kiện</Title>
            <Button
               icon={<ArrowLeftOutlined />}
               onClick={() => router.push('/admin/events')}
            >
               Quay lại danh sách
            </Button>
         </div>

         <Card>
            <Form
               form={form}
               layout="vertical"
               onFinish={onFinish}
               validateMessages={validateMessages}
               scrollToFirstError
            >
               <Row gutter={24}>
                  <Col span={24}>
                     <Title level={4}>Thông tin cơ bản</Title>
                  </Col>

                  <Col span={16}>
                     <Form.Item
                        name="name"
                        label="Tên sự kiện"
                        rules={[{ required: true }]}
                     >
                        <Input placeholder="Nhập tên sự kiện" />
                     </Form.Item>
                  </Col>

                  <Col span={8}>
                     <Form.Item
                        name="type"
                        label="Loại sự kiện"
                        rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
                     >
                        <Select 
                           placeholder="Chọn loại sự kiện"
                           dropdownRender={(menu) => (
                              <div>
                                 {menu}
                              </div>
                           )}
                        >
                           {Object.entries(eventTypeMapping).map(([key, value]: [string, any]) => (
                              <Option key={key} value={key}>
                                 <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Tag color={value.tagColor} style={{ marginRight: 8 }}>{value.label}</Tag>
                                    {value.label}
                                 </div>
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Col>

                  <Col span={24}>
                     <Form.Item
                        name="description"
                        label="Mô tả sự kiện"
                        rules={[{ required: true }]}
                     >
                        <TextArea
                           placeholder="Nhập mô tả chi tiết về sự kiện"
                           rows={4}
                        />
                     </Form.Item>
                  </Col>

                  <Col span={24}>
                     <Form.Item
                        name="image"
                        label="Ảnh bìa sự kiện (URL)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập URL ảnh bìa!' },
                           { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }
                        ]}
                        extra="Nhập URL hình ảnh từ internet (https://example.com/image.jpg)"
                     >
                        <Input
                           placeholder="https://example.com/image.jpg"
                           addonAfter={<EyeOutlined onClick={() => {
                              const url = form.getFieldValue('image');
                              if (url) window.open(url, '_blank');
                           }} />}
                        />
                     </Form.Item>
                     {imagePreviewUrl && (
                        <div style={{ marginTop: '-20px', marginBottom: '24px' }}>
                           <img
                              src={imagePreviewUrl}
                              alt="Preview"
                              style={{
                                 maxWidth: '100%',
                                 maxHeight: '200px',
                                 objectFit: 'contain',
                                 marginTop: '10px',
                                 border: '1px solid #d9d9d9',
                                 borderRadius: '8px',
                                 padding: '4px',
                                 display: imageError ? 'none' : 'block'
                              }}
                              onError={() => {
                                 setImageError(true);
                                 message.error('Không thể tải ảnh từ URL này');
                              }}
                              onLoad={() => {
                                 setImageError(false);
                              }}
                           />
                        </div>
                     )}
                  </Col>
                  
                  <Col span={24}>
                     <Form.Item
                        name="zoneMap"
                        label="Sơ đồ khu vực (URL)"
                        rules={[
                           { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }
                        ]}
                        extra="Nhập URL hình ảnh sơ đồ khu vực của sự kiện (không bắt buộc)"
                     >
                        <Input
                           placeholder="https://example.com/zone-map.jpg"
                           addonAfter={<EyeOutlined onClick={() => {
                              const url = form.getFieldValue('zoneMap');
                              if (url) window.open(url, '_blank');
                           }} />}
                        />
                     </Form.Item>
                     {zoneMapPreviewUrl && (
                        <div style={{ marginTop: '-20px', marginBottom: '24px' }}>
                           <img
                              src={zoneMapPreviewUrl}
                              alt="Zone Map Preview"
                              style={{
                                 maxWidth: '100%',
                                 maxHeight: '200px',
                                 objectFit: 'contain',
                                 marginTop: '10px',
                                 border: '1px solid #d9d9d9',
                                 borderRadius: '8px',
                                 padding: '4px',
                                 display: zoneMapError ? 'none' : 'block'
                              }}
                              onError={() => {
                                 setZoneMapError(true);
                                 message.error('Không thể tải ảnh sơ đồ từ URL này');
                              }}
                              onLoad={() => {
                                 setZoneMapError(false);
                              }}
                           />
                        </div>
                     )}
                  </Col>
               </Row>

               <Divider />

               <Row gutter={24}>
                  <Col span={24}>
                     <Title level={4}>Thời gian và địa điểm</Title>
                  </Col>

                  <Col span={12}>
                     <Form.Item
                        name="dateRange"
                        label="Ngày diễn ra"
                        rules={[{ required: true }]}
                     >
                        <RangePicker
                           style={{ width: '100%' }}
                           placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                           format="DD/MM/YYYY"
                        />
                     </Form.Item>
                  </Col>

                  <Col span={12}>
                     <Form.Item
                        name="time"
                        label="Giờ diễn ra"
                        rules={[{ required: true }]}
                     >
                        <TimePicker.RangePicker
                           style={{ width: '100%' }}
                           format="HH:mm"
                           placeholder={['Giờ bắt đầu', 'Giờ kết thúc']}
                        />
                     </Form.Item>
                  </Col>

                  <Col span={12}>
                     <Form.Item
                        name="address"
                        label="Địa điểm"
                        rules={[{ required: true }]}
                     >
                        <Input placeholder="Nhập địa điểm tổ chức sự kiện" />
                     </Form.Item>
                  </Col>

                  <Col span={12}>
                     <Form.Item
                        name="maxBuy"
                        label="Số lượng vé tối đa mỗi người"
                        rules={[{ required: true }]}
                        help="Giới hạn số vé tối đa mà mỗi người có thể mua."
                     >
                        <InputNumber
                           min={1}
                           style={{ width: '100%' }}
                           placeholder="Ví dụ: 4"
                        />
                     </Form.Item>
                  </Col>
               </Row>

               <Divider />

               <Row gutter={24}>
                  <Col span={24}>
                     <Title level={4}>Thông tin giá cơ bản</Title>
                  </Col>

                  <Col span={8}>
                     <Form.Item
                        name="price"
                        label="Giá vé cơ bản (VNĐ)"
                        rules={[{ required: true }]}
                        help="Giá vé cơ bản để tham khảo. Bạn sẽ tạo các khu vực với giá khác nhau sau khi tạo sự kiện."
                     >
                        <InputNumber
                           min={0}
                           step={10000}
                           style={{ width: '100%' }}
                           placeholder="Nhập giá vé cơ bản"
                           formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                     </Form.Item>
                  </Col>
               </Row>

               <Divider />

               <Form.Item>
                  <Space>
                     <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isUpdating}
                     >
                        Lưu thay đổi
                     </Button>
                     <Button onClick={() => router.push('/admin/events')}>
                        Hủy
                     </Button>
                  </Space>
               </Form.Item>
            </Form>
         </Card>
      </>
   );
}
