import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { handleApiError } from '@/utils/apiErrorHandler';

export interface Event {
  id: string;
  name: string; // Note: this will be mapped to 'title' in the UI
  description: string;
  image: string;
  location: string;
  startedDate: string; // Note: this will be mapped to 'date' in the UI
  endedDate: string;
  startedTime: string;
  endedTime: string;
  maxBuy: number;
  price: number;
  status: 'published' | 'draft' | 'cancelled';
  ticketsSold?: number;
  totalTickets?: number; // This may be calculated from maxBuy
  createdAt: string;
  updatedAt: string;
}

// Hàm gọi API lấy danh sách sự kiện
const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await axiosClient.get('/events');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Hook useGetAllEvents
export const useGetAllEvents = () => {
  return useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Chuyển đổi dữ liệu từ API để phù hợp với UI component
export const mapEventToUIFormat = (event: Event) => {
  // Determine event type based on name or description keywords
  let eventType = "music"; // Default type
  
  const nameAndDesc = (event.name + " " + (event.description || "")).toLowerCase();
  
  if (nameAndDesc.includes("sport") || 
      nameAndDesc.includes("marathon") || 
      nameAndDesc.includes("thể thao")) {
    eventType = "sport";
  } else if (nameAndDesc.includes("fan") || 
             nameAndDesc.includes("meeting") || 
             nameAndDesc.includes("gặp mặt")) {
    eventType = "fan_meeting";
  } else if (nameAndDesc.includes("live") || 
             nameAndDesc.includes("concert") || 
             nameAndDesc.includes("nhạc sống")) {
    eventType = "live";
  }
  
  return {
    id: event.id,
    title: event.name,
    date: event.startedDate,
    location: event.location,
    status: event.status || 'published',
    tickets_sold: event.ticketsSold || 0,
    total_tickets: event.maxBuy || 0,
    description: event.description,
    image: event.image,
    price: event.price,
    type: eventType  // Add event type
  };
};
