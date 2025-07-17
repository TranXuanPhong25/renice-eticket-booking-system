// Hook for getting zones by event ID using React Query's useQuery
import { ZoneResponse } from '@/types/zone';
import { apiErrorHandler } from '@/utils/apiErrorHandler';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from '@tanstack/react-query';
// Function to fetch zones for an event
export const fetchEventZones = async (eventId: string): Promise<ZoneResponse[]> => {
  try {
    const response = await axiosClient.get(`/tickets/${eventId}`);
    return response.data;
  } catch (error) {
    throw apiErrorHandler(error);
  }
};


export const useGetEventZones = (eventId: string) => {
  return useQuery<ZoneResponse[], Error>({
    queryKey: ['zones', eventId],
    queryFn: () => fetchEventZones(eventId),
    enabled: !!eventId, // Only run the query if eventId is provided
  });
};
