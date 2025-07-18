import { Hospital, CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from '@/types/hospital.d'
import { ApiResponse, ApiPaginatedResponse } from '@/types/response.d'
import http from '../http'

export const hospitalApi = {
  // Get all hospitals
  getHospitals: (params?: HospitalQueryDto) => {
    return http.get<ApiPaginatedResponse<Hospital>>('/hospitals', {
      searchParams: params
    })
  },

  // Get hospital by ID
  getHospitalById: (id: string) => {
    return http.get<ApiResponse<Hospital>>(`/hospitals/${id}`)
  },

  // Create new hospital
  createHospital: (data: CreateHospitalDto) => {
    return http.post<ApiResponse<Hospital>>('/hospitals', data)
  },

  // Update hospital
  updateHospital: (id: string, data: UpdateHospitalDto) => {
    return http.patch<ApiResponse<Hospital>>(`/hospitals/${id}`, data)
  },

  // Delete hospital (soft delete)
  deleteHospital: (id: string) => {
    return http.delete<ApiResponse<void>>(`/hospitals/${id}`)
  },

  // Get hospital blood inventory
  getHospitalBloodInventory: (id: string) => {
    return http.get<ApiResponse<Hospital>>(`/hospitals/${id}/blood-inventory`)
  },

  // Helper method to get hospital names for select dropdown
  getHospitalNames: () => {
    return http.get<ApiResponse<{ _id: string; name: string }[]>>('/hospitals/names')
  }
}
