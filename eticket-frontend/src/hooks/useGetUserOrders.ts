import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { OrderResponse } from '@/types/order';

// Hàm lấy danh sách đơn hàng của người dùng
const fetchUserOrders = async (userId?: string): Promise<OrderResponse[]> => {
  try {
    // Nếu có userId, lấy đơn hàng theo userId, nếu không lấy đơn hàng của user hiện tại
    const endpoint = `/orders?userId=${userId || ''}`;
    const response = await axiosClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook useGetUserOrders
export const useGetUserOrders = (userId?: string) => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ['userOrders', userId],
    queryFn: () => fetchUserOrders(userId),
    enabled: true, // Luôn chạy query này khi component mount
    refetchOnWindowFocus: true // Refetch khi focus lại trang
  });
};
