import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import { ZoneFormData, ZoneResponse } from '@/types/zone';


// Function to create a zone
const createZone = async (zoneData: ZoneFormData): Promise<ZoneResponse> => {
  try {
    // Send request to create zone
    const response = await axiosClient.post(`/tickets/${zoneData.eventId}`, {zones:[{
      ...zoneData,
      event: { id: zoneData.eventId } // Ensure event is included in the request
    }]});
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};

// Hook for creating zones
export const useCreateZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ZoneResponse, Error, ZoneFormData>({
    mutationFn: createZone,
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['event', data.eventId] });
      queryClient.invalidateQueries({ queryKey: ['zones', data.eventId] });
    },
    onError: (error) => {
      console.error('Failed to create zone:', error.message);
    }
  });
};

