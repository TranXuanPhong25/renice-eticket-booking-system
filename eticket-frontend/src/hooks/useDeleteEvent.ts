import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';

// Hàm xóa sự kiện
const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await axiosClient.delete(`/events/${eventId}`);
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook useDeleteEvent
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      // Khi xóa thành công, invalidate query danh sách sự kiện để refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Failed to delete event:', error.message);
    }
  });
};
