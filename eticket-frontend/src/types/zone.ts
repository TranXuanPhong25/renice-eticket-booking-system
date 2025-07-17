// Zone Status Types
export type ZoneStatus = 'available' | 'out' | 'reserved';

// Zone Data Interface
export interface ZoneFormData {
  eventId: string;
  name: string;
  price: number;
  color: string;
  status: ZoneStatus;
  capacity?: number;
}

export interface ZoneUpdateData {
  name?: string;
  price?: number;
  color?: string;
  status?: ZoneStatus;
  capacity?: number;
}

export interface ZoneResponse extends ZoneFormData {
  id: string;
}
