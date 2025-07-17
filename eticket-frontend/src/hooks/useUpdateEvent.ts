import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { useRouter } from 'next/navigation';
import { Event } from './useGetAllEvents';

// Định nghĩa kiểu dữ liệu cho form cập nhật sự kiện
export interface EventUpdateFormData {
  name: string;
  description: string;
  image: string;
  startedDate: string | number;
  endedDate: string | number;
  startedTime: string;
  endedTime: string;
  maxBuy: number;
  price?: number;
  zoneMap?: string;
  address: string;
  type: string;
  status?: string;
}

// Hàm cập nhật sự kiện
const updateEvent = async (eventId: string, eventData: EventUpdateFormData): Promise<Event> => {
  try {
    const response = await axiosClient.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook useUpdateEvent
export const useUpdateEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<Event, Error, EventUpdateFormData>({
    mutationFn: (data) => updateEvent(eventId, data),
    onSuccess: () => {
      // Khi cập nhật thành công, invalidate queries liên quan
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      
      // Chuyển về trang danh sách sự kiện
      router.push('/admin/events');
    },
    onError: (error) => {
      console.error('Failed to update event:', error.message);
    }
  });
};
