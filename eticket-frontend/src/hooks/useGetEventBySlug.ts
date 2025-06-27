"use client";

import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/axiosClient';
import { handleApiError } from '@/utils/apiErrorHandler';
import { Event } from './useGetAllEvents';

// Extended event details interface
export interface EventDetails extends Omit<Event, 'location'> {
  address?: string;
  location?: string;
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
  seats?: Array<{
    id: string;
    name: string;
    price: number;
    color: string;
    points: string;
    status: 'available' | 'out' | 'reserved';
  }>;
  socials?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    slug?: string;
  };
  type?: string;
}

// Function to fetch an event by ID or slug
const fetchEventBySlug = async (slug: string): Promise<EventDetails> => {
  try {
    // First try to get by slug
    const ID_REGEX = /.{36}$/; // Regex to check if slug is a numeric ID
    const id = slug.match(ID_REGEX);
    console.log(`Fetching event by slug or ID: ${id}`);
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    // If there's an error, check if it's a 404 (not found by slug)
    // In that case, try to get by ID if the slug is a valid ID
    if (isNumeric(slug)) {
      try {
        const idResponse = await axiosClient.get(`/events/${slug}`);
        return idResponse.data;
      } catch (innerError) {
        throw handleApiError(innerError);
      }
    }
    
    throw handleApiError(error);
  }
};

// Helper function to check if a string is numeric (valid ID)
const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// Hook for getting an event by slug or ID
export const useGetEventBySlug = (slug: string) => {
  return useQuery<EventDetails, Error>({
    queryKey: ['event', slug],
    queryFn: () => fetchEventBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!slug, // Only run the query if slug is provided
  });
};

// Function to map API event data to detailed format needed for display
export const mapEventToDetailedFormat = (event: Event | EventDetails): EventDetails => {
  // Convert from API format to our detailed UI format
  return {
    ...event,
    // Map existing fields
    address: event.location || '',
    
    // Default values for fields that might not be in the API response
    artists: (event as EventDetails).artists || [],
    hosts: (event as EventDetails).hosts || [],
    seats: (event as EventDetails).seats || [],
    socials: {
      facebook: (event as EventDetails).socials?.facebook || '',
      youtube: (event as EventDetails).socials?.youtube || '',
      slug: event.id.toString(),
    },
    
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
