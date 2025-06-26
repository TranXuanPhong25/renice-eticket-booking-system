import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho sự kiện
export interface EventFormData {
  name: string;
  description: string;
  image: string;
  location: string;
  startedDate: string;
  endedDate: string;
  startedTime: string;
  endedTime: string;
  maxBuy: number;
  price: number;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  startedDate: string;
  endedDate: string;
  startedTime: string;
  endedTime: string;
  maxBuy: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Hàm tạo sự kiện
const createEvent = async (eventData: EventFormData): Promise<EventResponse> => {
  try {
    // axiosClient already includes withCredentials: true
    // Cookies (JSESSIONID, access_token) will be sent automatically
    const response = await axiosClient.post('/events', eventData);
    return response.data;
  } catch (error) {
    // Process API errors consistently using the error handler
    throw apiErrorHandler(error);
  }
};

// Hook useCreateEvent
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<EventResponse, Error, EventFormData>({
    mutationFn: createEvent,
    onSuccess: () => {
      // Khi tạo thành công, invalidate query danh sách sự kiện để refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      // Redirect to events list page
      router.push('/admin/events');
    },
    onError: (error) => {
      // Error already handled by apiErrorHandler in createEvent
      console.error('Failed to create event:', error.message);
    }
  });
};
