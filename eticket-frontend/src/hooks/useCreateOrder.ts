import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { useRouter } from 'next/navigation';
import { OrderRequest, OrderResponse } from '@/types/order';

// Hàm tạo sự kiện
const CreateOrder = async (eventData: OrderRequest): Promise<OrderResponse> => {
  try {
    const response = await axiosClient.post('/orders', eventData);
    return response.data;
  } catch (error) {
    // Process API errors consistently using the error handler
    throw apiErrorHandler(error);
  }
};

// Hook useCreateOrder
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<OrderResponse, Error, OrderRequest>({
    mutationFn: CreateOrder,
    onSuccess: () => {
      // Khi tạo thành công, invalidate query danh sách sự kiện để refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
    },
    onError: (error) => {
      // Error already handled by apiErrorHandler in CreateOrder
      console.error('Failed to create event:', error.message);
    }
  });
};
