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
  slug?: string;  // Optional slug for URLs
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
  
  // Generate a slug if not provided
  const slug = event.slug || generateSlug(event.name, event.id);
  
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
    type: eventType,  // Add event type
    slug: slug  // Add slug for URLs
  };
};

// Helper function to generate a slug from a title
function generateSlug(title: string, id: string): string {
  // Convert to lowercase, replace non-alphanumeric with hyphens
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Add ID to ensure uniqueness
  return `${baseSlug}-${id}`;
}
