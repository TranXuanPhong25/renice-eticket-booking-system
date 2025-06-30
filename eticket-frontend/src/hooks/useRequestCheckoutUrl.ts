import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/axiosClient";
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { CheckoutRequest } from "@/types/checkout";


// Hàm gọi API để lấy URL thanh toán
const getCheckoutUrl = async (data: CheckoutRequest): Promise<string> => {
  try {
    const response = await axiosClient.post(`/checkout`, data);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

export const useRequestCheckoutUrl = () => {
  return useMutation<string, Error, CheckoutRequest>({
    mutationFn: getCheckoutUrl,
    onSuccess: (data) => {
      console.log('URL thanh toán đã được tạo:', data);
    },
    onError: (error) => {
      console.error('Lỗi khi tạo URL thanh toán:', error.message);
    }
  });
};