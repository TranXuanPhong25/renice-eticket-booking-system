"use client";

import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { handleApiError } from '@/utils/apiErrorHandler';
import { Event } from './useGetAllEvents';
import { Seat } from '@/types/seat';

// Extended event details interface
export interface EventDetails extends Omit<Event, 'location'> {
  address: string;
  artists?: Array<{
    id?: string;
    name: string;
    image?: string;
  }>;
  hosts?: Array<{
    id?: string;
    name: string;
    image?: string;
  }>;
  zones?: Array<Seat>;
  socials?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    slug?: string;
  };
  type?: string;
  zoneMap: string; // URL to the zone map image
}

// Function to fetch an event by ID or slug
const fetchEventById = async (id:string|null): Promise<EventDetails> => {
  if (!id) {
    throw new Error('Invalid event ID or slug provided');
  }
  try {
    // First try to get by slug

    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function to check if a string is numeric (valid ID)
const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// Hook for getting an event by slug or ID
export const useGetEventById = (id: string|null) => {
  return useQuery<EventDetails, Error>({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!id, // Only run the query if slug is provided
  });
};

// Function to map API event data to detailed format needed for display
export const mapEventToDetailedFormat = (event: Event | EventDetails): EventDetails => {
  // Convert from API format to our detailed UI format
  return {
    ...event,
    // Map existing fields
    address: event.address || '',
    
    // Default values for fields that might not be in the API response
    artists: (event as EventDetails).artists || [],
    hosts: (event as EventDetails).hosts || [],
    zones: (event as EventDetails).zones || [],
    socials: {
      facebook: (event as EventDetails).socials?.facebook || '',
      youtube: (event as EventDetails).socials?.youtube || '',
      slug: event.id.toString(),
    },
    zoneMap: (event as EventDetails).zoneMap || '', // URL to the zone map image
    // Additional fields with default values
    type: (event as EventDetails).type || determineEventType(event as Event),
    maxBuy: event.maxBuy || 4, // Default max tickets per purchase
  };
};

// Helper function to determine event type based on name and description
function determineEventType(event: Event): string {
  const nameAndDesc = (event.name + " " + (event.description || "")).toLowerCase();
  
  if (nameAndDesc.includes("sport") || 
      nameAndDesc.includes("marathon") || 
      nameAndDesc.includes("thể thao")) {
    return "sport";
  } else if (nameAndDesc.includes("fan") || 
             nameAndDesc.includes("meeting") || 
             nameAndDesc.includes("gặp mặt")) {
    return "fan_meeting";
  } else if (nameAndDesc.includes("live") || 
             nameAndDesc.includes("concert") || 
             nameAndDesc.includes("nhạc sống")) {
    return "live";
  }
  
  return "music"; // Default type
}
