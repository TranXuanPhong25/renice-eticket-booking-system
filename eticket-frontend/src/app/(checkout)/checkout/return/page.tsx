"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Result, Button, Spin, Card, Descriptions, Tag, Alert } from 'antd';
import { Container } from '@/components/Container';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import { useGetOrderById } from '@/hooks/useGetOrderById';
import { useRouter } from 'next/navigation';

export default function CheckoutReturnPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [isUpdating, setIsUpdating] = useState(false);
   const [updateAttempted, setUpdateAttempted] = useState(false);

   // Lấy thông tin từ query parameters
   let orderId = searchParams.get('vpc_OrderInfo') || '';
   // Format UUID correctly
   if (orderId && orderId.length >= 32) {
      orderId = orderId.substring(0, 8) + "-" +
         orderId.substring(8, 12) + "-" +
         orderId.substring(12, 16) + "-" +
         orderId.substring(16, 20) + "-" +
         orderId.substring(20);
   }
   
   const paymentId = searchParams.get('vpc_TransactionNo') || '';
   const responseCode = searchParams.get('vpc_TxnResponseCode') || '';
   
   // Sử dụng hooks
   const { mutate: updateOrderStatus } = useUpdateOrderStatus();
   const { 
      data: orderData, 
      isLoading, 
      error, 
      refetch,
      isSuccess 
   } = useGetOrderById(orderId);

   // Xác định trạng thái thanh toán
   const isPaymentSuccessful = responseCode === '0';

   // Cập nhật trạng thái đơn hàng chỉ sau khi đã nhận được dữ liệu đơn hàng
   useEffect(() => {
      if (
         orderId && 
         !isUpdating && 
         isSuccess && 
         orderData && 
         !updateAttempted && 
         responseCode
      ) {
         // Chỉ cập nhật nếu trạng thái hiện tại không phải là PAID hoặc COMPLETED
         if (orderData.orderStatus !== 'PAID' && orderData.orderStatus !== 'COMPLETED') {
            setIsUpdating(true);
            setUpdateAttempted(true);
            console.log('Cập nhật trạng thái đơn hàng:', orderId, 'với response code:', responseCode);

            updateOrderStatus({
               orderId,
               status: responseCode,
               paymentId,
               paymentInfo: {
                  returnTime: new Date().toISOString(),
                  paymentStatus: responseCode
               }
            }, {
               onSuccess: (data) => {
                  console.log('Cập nhật trạng thái thành công:', data);
                  refetch(); // Fetch lại thông tin đơn hàng sau khi cập nhật
                  setIsUpdating(false);
               },
               onError: (error) => {
                  console.error('Lỗi khi cập nhật trạng thái:', error);
                  setIsUpdating(false);
               }
            });
         } else {
            console.log('Đơn hàng đã được thanh toán trước đó:', orderData.orderStatus);
         }
      }
   }, [orderId, isSuccess, orderData, responseCode, paymentId, updateOrderStatus, refetch, isUpdating, updateAttempted]);

   // Hiển thị trạng thái tải
   if (isLoading || isUpdating) {
      return (
         <Container>
            <div className="py-12 flex flex-col items-center justify-center">
               <Spin size="large" />
               <div className="mt-4 text-gray-600">
                  {isUpdating ? 'Đang cập nhật trạng thái đơn hàng...' : 'Đang tải thông tin đơn hàng...'}
               </div>
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
                  message="Lỗi xử lý"
                  description={`Không thể xử lý thông tin thanh toán. Mã lỗi: ${error.message}. Vui lòng liên hệ với chúng tôi để được hỗ trợ.`}
                  type="error"
                  showIcon
               />
               <div className="mt-4 flex justify-center">
                  <Button type="primary" onClick={() => router.push('/')}>
                     Về trang chủ
                  </Button>
               </div>
            </div>
         </Container>
      );
   }

   return (
      <Container>
         <div className="py-12">
            {isPaymentSuccessful ? (
               <Result
                  status="success"
                  title="Thanh toán thành công!"
                  subTitle={`Mã đơn hàng: ${orderId}. Vé điện tử sẽ được gửi đến email của bạn.`}
                  extra={[
                     <Button
                        type="primary"
                        key="console"
                        onClick={() => router.push('/')}
                     >
                        Về trang chủ
                     </Button>,
                     <Button
                        key="orderDetails"
                        onClick={() => router.push(`/order/${orderId}`)}
                     >
                        Xem chi tiết đơn hàng
                     </Button>,
                  ]}
               />
            ) : (
               <Result
                  status="error"
                  title="Thanh toán thất bại!"
                  subTitle="Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
                  extra={[
                     <Button
                        type="primary"
                        key="tryAgain"
                        onClick={() => router.push(`/order/${orderId}/retry-payment`)}
                     >
                        Thử lại thanh toán
                     </Button>,
                     <Button
                        key="home"
                        onClick={() => router.push('/')}
                     >
                        Về trang chủ
                     </Button>,
                  ]}
               />
            )}

            {orderData && (
               <Card className="mt-8" title="Thông tin đơn hàng">
                  <Descriptions bordered column={1}>
                     <Descriptions.Item label="Mã đơn hàng">{orderData.id}</Descriptions.Item>
                     <Descriptions.Item label="Khách hàng">{orderData.customerName}</Descriptions.Item>
                     <Descriptions.Item label="Email">{orderData.customerEmail}</Descriptions.Item>
                     <Descriptions.Item label="Thời gian đặt">{new Date(orderData.orderTime).toLocaleString()}</Descriptions.Item>
                     <Descriptions.Item label="Tổng tiền">{orderData.totalAmount.toLocaleString()} VNĐ</Descriptions.Item>
                     <Descriptions.Item label="Trạng thái">
                        <Tag color={isPaymentSuccessful ? 'green' : 'red'}>
                           {isPaymentSuccessful ? 'Đã thanh toán' : 'Thanh toán thất bại'}
                        </Tag>
                     </Descriptions.Item>
                  </Descriptions>

                  {orderData.tickets && orderData.tickets.length > 0 && (
                     <div className="mt-4">
                        <h3 className="mb-2">Chi tiết vé</h3>
                        <Card className="bg-gray-50">
                           {orderData.tickets.map((ticket, index) => (
                              <div key={ticket.id} className="flex justify-between py-2 border-b last:border-b-0">
                                 <div>
                                    <div className="font-medium">{ticket.name}</div>
                                    <div className="text-xs text-gray-500">Mã vé: {ticket.id}</div>
                                 </div>
                                 <div className="text-right">
                                    <div>{ticket.amount.toLocaleString()} VNĐ</div>
                                 </div>
                              </div>
                           ))}
                        </Card>
                     </div>
                  )}
               </Card>
            )}
         </div>
      </Container>
   );
}