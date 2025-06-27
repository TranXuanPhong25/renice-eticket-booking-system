import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { message } from 'antd';

// Function to delete a zone
const deleteZone = async (zoneId: string): Promise<void> => {
  try {
    await axiosClient.delete(`/tickets/${zoneId}`);
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook for deleting a zone
export const useDeleteZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      // Invalidate zones queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      message.success('Xóa khu vực thành công!');
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi xóa khu vực: ${error.message}`);
    },
  });
};
