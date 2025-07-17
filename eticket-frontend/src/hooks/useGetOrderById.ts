import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { OrderResponse } from '@/types/order';

// Hàm lấy thông tin đơn hàng theo ID
const fetchOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook useGetOrderById
export const useGetOrderById = (orderId: string) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ['orders', orderId],  
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId, // Chỉ chạy query khi có orderId
    staleTime: 1000 * 60 * 5, // Dữ liệu "cũ" sau 5 phút
    refetchOnWindowFocus: false // Không refetch khi focus lại trang
  });
};
