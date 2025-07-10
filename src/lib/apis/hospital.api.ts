import { Hospital, CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from '@/types/hospital';
import http from '@/lib/http';

const BASE_URL = '/hospitals';

// The backend response for paginated data might be different.
// Adjust this interface based on the actual API response structure.
interface PaginatedHospitalsResponse {
  data: Hospital[];
  total: number;
  page: number;
  limit: number;
  // Add any other pagination fields from your backend response
}

export const hospitalApi = {
  async getHospitals(query: HospitalQueryDto = {}): Promise<PaginatedHospitalsResponse> {
    const params = new URLSearchParams();
    Object.keys(query).forEach(key => {
      const value = query[key as keyof HospitalQueryDto];
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await http.get<PaginatedHospitalsResponse>(`${BASE_URL}?${params.toString()}`);
    return response.payload;
  },

  async getHospitalById(id: string): Promise<Hospital> {
    const response = await http.get<Hospital>(`${BASE_URL}/${id}`);
    return response.payload;
  },

  async createHospital(data: CreateHospitalDto): Promise<Hospital> {
    const response = await http.post<Hospital>(BASE_URL, data);
    return response.payload;
  },

  async updateHospital(id: string, data: UpdateHospitalDto): Promise<Hospital> {
    const response = await http.patch<Hospital>(`${BASE_URL}/${id}`, data);
    return response.payload;
  },

  async deleteHospital(id: string): Promise<void> {
    await http.delete(`${BASE_URL}/${id}`);
  },
};
