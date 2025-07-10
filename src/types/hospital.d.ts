// Based on backend schemas and DTOs

export interface ContactInfo {
  phone: string;
  email?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BloodInventoryItem {
  bloodType: string; // Enum in backend, string for simplicity in FE
  component: string; // Enum in backend
  quantity: number;
  expiresAt: string; // Date string
}

export interface Hospital {
  _id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  contactInfo: ContactInfo;
  operatingHours: string;
  coordinates: Coordinates;
  bloodInventory: BloodInventoryItem[];
  isActive: boolean;
  description: string;
  services: string[];
  emergencyContact: string;
  licenseNumber?: string;
  establishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a new hospital
export type CreateHospitalDto = Omit<Hospital, '_id' | 'createdAt' | 'updatedAt' | 'isActive' | 'bloodInventory'>;

// DTO for updating a hospital
export type UpdateHospitalDto = Partial<CreateHospitalDto>;

// DTO for query parameters
export interface HospitalQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  province?: string;
  district?: string;
  ward?: string;
  bloodType?: string;
  component?: string;
  minQuantity?: number;
  isActive?: boolean;
  availableNow?: boolean;
  [key: string]: any; // Allow other properties
}
