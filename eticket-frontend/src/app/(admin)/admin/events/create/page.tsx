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
   Switch,
   Upload,
   Card,
   message,
   Typography,
   Divider,
   Space,
   Row,
   Col,
   Breadcrumb,
   Spin,
   Alert
} from 'antd';
import { PlusOutlined, InboxOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useCreateEvent, EventFormData } from '@/hooks/useCreateEvent';
import { handleApiError } from '@/utils/apiErrorHandler';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function CreateEvent() {
   const [form] = Form.useForm();
   // loading state không cần thiết nữa vì đã có isPending từ react-query
   const router = useRouter();
   const [imagePreviewUrl, setImagePreviewUrl] = useState('');
   const [imageError, setImageError] = useState(false);

   // Theo dõi thay đổi URL ảnh để hiển thị xem trước
   const formValues = Form.useWatch(['coverUrl'], form);

   useEffect(() => {
      // Đợi người dùng nhập xong rồi mới hiển thị ảnh xem trước
      const timer = setTimeout(() => {
         const url = form.getFieldValue('coverUrl');
         if (url) {
            setImagePreviewUrl(url);
            setImageError(false);
         }
      }, 500);

      return () => clearTimeout(timer);
   }, [formValues, form]);

   // Sử dụng hook useCreateEvent
   const { mutate: createEvent, isPending } = useCreateEvent();

   const onFinish = async (values: any) => {
      try {
         console.log('Form values:', values);
         // Format lại các giá trị ngày tháng
         const formattedValues: EventFormData = {
            name: values.name,
            description: values.description,
            image: values.image,
            location: values.location,
            maxBuy: values.maxBuy,
            price: values.price,
            startedDate: values.dateRange[0].unix(), 
            endedDate: values.dateRange[1].unix(),
            startedTime: values.time[0].format('HH:mm'),
            endedTime: values.time[1].format('HH:mm'),
         };

         // Gọi API tạo sự kiện thông qua hook
         createEvent(formattedValues, {
            onSuccess: (data) => {
               message.success('Tạo sự kiện thành công!');
               console.log('Sự kiện đã được tạo:', data);
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
               { title: 'Tạo sự kiện mới' },
            ]}
            className="mb-4"
         />

         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>Tạo sự kiện mới</Title>
            <Button
               icon={<ArrowLeftOutlined />}
               onClick={() => router.push('/admin/events')}
            >
               Quay lại danh sách
            </Button>
         </div>
         <Alert
            message="Lưu ý về quy trình tạo sự kiện"
            description="Bước 1: Tạo thông tin cơ bản của sự kiện. Bước 2: Sau khi tạo sự kiện, bạn có thể tạo các khu vực ngồi (zones) từ danh sách sự kiện."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
         />
         <Card>
            <Form
               form={form}
               layout="vertical"
               onFinish={onFinish}
               validateMessages={validateMessages}
               scrollToFirstError
               initialValues={{
                  isPublished: false,
                  capacity: 100,
               }}
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
                              const url = form.getFieldValue('coverUrl');
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
                        name="location"
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
                     <Button type="primary" htmlType="submit" loading={isPending}>
                        Tạo sự kiện
                     </Button>
                     <Button onClick={() => form.resetFields()}>
                        Xóa form
                     </Button>
                  </Space>
               </Form.Item>
            </Form>
         </Card>
      </>
   );
}
