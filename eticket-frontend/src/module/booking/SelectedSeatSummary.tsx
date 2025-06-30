import { Button, Card, Tooltip, Divider, Tag, message, Modal, Input, Form } from "antd";
import { useState } from "react";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useRequestCheckoutUrl } from "@/hooks/useRequestCheckoutUrl";
import { CheckoutRequest } from "@/types/checkout";
import { OrderRequest, SeatSelection } from "@/types/order";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export const SelectedSeatSummary = (props: any) => {
  const { selectedSeats, maxBuy = 4, totalTickets = 0, eventId,eventName } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const {user} = useAuth();
  // Sử dụng hooks
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: getCheckoutUrl, isPending: isGettingCheckoutUrl } = useRequestCheckoutUrl();
  
  // Tính tổng tiền
  const totalPrice = selectedSeats.reduce(
    (sum: number, seat: any) => sum + (seat.price * seat.quantity),
    0
  );
  
  // Kiểm tra xem có vượt quá giới hạn không
  const exceedLimit = totalTickets > maxBuy;

  // Xử lý khi người dùng nhấn nút thanh toán
  const handleCheckoutClick = () => {
    if (!exceedLimit && selectedSeats.length > 0) {
      setIsModalOpen(true);
    }
  };

  // Xử lý tạo đơn hàng và lấy URL thanh toán
  const handleCreateOrder = () => {
    form.validateFields().then(values => {
      // Tạo dữ liệu cho đơn hàng
      const seatSelections: SeatSelection[] = selectedSeats.map((seat: any) => ({
        zoneId: seat.id,
        quantity: seat.quantity,
        amount: seat.price 
      }));

      const orderRequest: OrderRequest = {
        userId: user?.id||"",
        customerName: values.name,
        customerEmail: values.email,
        seatSelections: seatSelections,
        totalAmount: totalPrice // Thêm tổng tiền vào đơn hàng
      };

      setIsProcessing(true);

      // Gọi API tạo đơn hàng
      createOrder(orderRequest, {
        onSuccess: (orderResponse) => {
          message.success("Đơn hàng đã được tạo!");
          console.log("Order created:", orderResponse);

          // Chuẩn bị dữ liệu để lấy URL thanh toán
          const checkoutRequest: CheckoutRequest = {
            orderId: orderResponse.id,
            eventName: eventName, // Tên sự kiện để hiển thị trong thanh toán
            againLink: window.location.href, // Chuyển hướng lại trang sự kiện sau khi thanh toán
            amount: totalPrice.toString() // Số tiền cần thanh toán
          };

          // Gọi API lấy URL thanh toán
          getCheckoutUrl(checkoutRequest, {
            onSuccess: (checkoutResponse) => {
              setIsProcessing(false);
              setIsModalOpen(false);
              console.log("Checkout URL:", checkoutResponse);
              // Chuyển hướng đến URL thanh toán
              if (checkoutResponse) {
                window.location.href = checkoutResponse;
              } else {
                message.error("Không thể tạo URL thanh toán");
              }
            },
            onError: (error) => {
              setIsProcessing(false);
              message.error(`Lỗi khi tạo URL thanh toán: ${error.message}`);
            }
          });
        },
        onError: (error) => {
          setIsProcessing(false);
          message.error(`Lỗi khi tạo đơn hàng: ${error.message}`);
        }
      });
    });
  };
  return (
    <>
      <Card
        size="small"
        title="Vé đã chọn"
        extra={<span className="text-xs text-gray-500">Giới hạn: {maxBuy} vé</span>}
        actions={[
          <Tooltip 
            title={exceedLimit ? `Bạn chỉ có thể mua tối đa ${maxBuy} vé` : (selectedSeats.length === 0 ? "Vui lòng chọn ít nhất 1 vé" : "")} 
            key="continue"
          >
            <Button 
              size="large" 
              className="w-full mx-2" 
              type="primary"
              disabled={exceedLimit || selectedSeats.length === 0}
              onClick={handleCheckoutClick}
            >
              {exceedLimit ? `Vượt quá giới hạn ${maxBuy} vé` : "Thanh toán"}
            </Button>
          </Tooltip>,
        ]}
      >
        {selectedSeats.length > 0 ? (
          <div className="space-y-3">
            {selectedSeats.map((seat: any) => (
              <div key={seat.id} className="rounded-lg border border-gray-200">
                <div className="flex justify-between gap-1 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">Hạng vé</span>
                    <div className="text-sm flex items-center">{seat.name} <Tag className={`!rounded-full !size-4  !ml-2`} color={seat.color}/> </div>
                    

                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-xs">Số lượng</span>
                    <span className="text-sm">x{seat.quantity}</span>
                  </div>
                </div>
                <Divider className="my-1" />
                <div className="flex justify-between px-3 pb-3">
                  <span className="text-xs">Đơn giá:</span>
                  <span className="text-sm font-medium">{seat.price.toLocaleString()} VNĐ</span>
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-between font-medium">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString()} VNĐ</span>
            </div>
            
            <div className="text-xs text-gray-500 pt-1">
              Đã chọn: {totalTickets}/{maxBuy} vé
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-gray-500">
            Bạn chưa chọn vé, vui lòng lựa chọn vé để thanh toán!
          </div>
        )}
      </Card>

      {/* Modal nhập thông tin người dùng */}
      <Modal
        title="Thông tin đặt vé"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isProcessing} 
            onClick={handleCreateOrder}
          >
            Tiếp tục thanh toán
          </Button>,
        ]}
      >
        <div className="my-4">
          <p className="font-medium mb-2">Tóm tắt đơn hàng:</p>
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex justify-between mb-2">
              <span>Số lượng vé:</span>
              <span>{totalTickets}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Tổng tiền:</span>
              <span>{totalPrice.toLocaleString()} VNĐ</span>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', email: '' }}
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên người đặt vé" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email để nhận thông tin vé" />
          </Form.Item>
        </Form>

        <div className="text-xs text-gray-500 mt-2">
          * Vé điện tử sẽ được gửi qua email sau khi thanh toán thành công
        </div>
      </Modal>
    </>
  );
};
