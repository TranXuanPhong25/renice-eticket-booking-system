import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { message } from 'antd';
import { ZoneUpdateData, ZoneResponse } from '@/types/zone';

// Function to update a zone
const updateZone = async (zoneId: string, zoneData: ZoneUpdateData): Promise<ZoneResponse> => {
  try {
    const response = await axiosClient.put(`/tickets/${zoneId}`, zoneData);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook for updating a zone
export const useUpdateZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, zoneData }: { zoneId: string; zoneData: ZoneUpdateData }) => 
      updateZone(zoneId, zoneData),
    onSuccess: () => {
      // Invalidate zones queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      message.success('Cập nhật khu vực thành công!');
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi cập nhật khu vực: ${error.message}`);
    },
  });
};
