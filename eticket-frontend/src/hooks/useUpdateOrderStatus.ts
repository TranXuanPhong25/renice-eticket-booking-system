import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { OrderResponse } from '@/types/order';


// Interface cho request cập nhật trạng thái đơn hàng
export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string | number; // Status có thể là number hoặc string tùy theo cổng thanh toán
  paymentId?: string; // ID thanh toán từ cổng thanh toán (nếu có)
  paymentInfo?: any; // Thông tin thanh toán bổ sung (nếu có)
}

// Hàm gọi API cập nhật trạng thái đơn hàng
const updateOrderStatus = async (request: UpdateOrderStatusRequest): Promise<OrderResponse> => {
  try {
    const { orderId, status } = request;
    // Gửi status dưới dạng string theo đúng yêu cầu của backend
    const response = await axiosClient.put(`/orders/${orderId}/status`, String(status));
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook useUpdateOrderStatus
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrderResponse, Error, UpdateOrderStatusRequest>({
    mutationFn: updateOrderStatus,
    onSuccess: (data, variables) => {
      // Khi cập nhật thành công, invalidate query chi tiết đơn hàng và danh sách đơn hàng
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      console.log('Đã cập nhật trạng thái đơn hàng:', data);
    },
    onError: (error) => {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
    }
  });
};
