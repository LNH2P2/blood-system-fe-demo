import http from '@/lib/http'
import { HospitalQueryDto, Hospital, BloodInventoryItem } from '@/types/hospital.d'
import { ApiResponse, ApiPaginatedResponse } from '@/types/response.d'
import {
  CreateBloodInventoryItemDto,
  UpdateBloodInventoryDto,
  BloodInventoryTableItem
} from '@/types/blood-inventory.d'

export const bloodInventoryApi = {
  // ============= Blood Inventory Collection (Main API) =============

  // Get all blood inventory items with pagination and filters
  getBloodInventory: (params?: HospitalQueryDto) => {
    // Filter out undefined values to prevent "undefined" strings in query params
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        )
      : undefined

    return http.get<ApiPaginatedResponse<BloodInventoryItem>>('/blood-inventory', {
      searchParams: cleanParams
    })
  },

  // Create new blood inventory item
  createBloodInventoryItem: (data: CreateBloodInventoryItemDto & { hospitalId: string }) => {
    return http.post<ApiResponse<BloodInventoryItem>>('/blood-inventory', {
      item: {
        hospitalId: data.hospitalId,
        bloodType: data.bloodType,
        component: data.component,
        quantity: data.quantity,
        expiresAt: new Date(data.expiresAt).toISOString()
      }
    })
  },

  // Get blood inventory items by hospital ID
  getBloodInventoryByHospital: (hospitalId: string, params?: HospitalQueryDto) => {
    // Filter out undefined values to prevent "undefined" strings in query params
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        )
      : undefined

    return http.get<ApiPaginatedResponse<BloodInventoryItem>>(`/blood-inventory/hospital/${hospitalId}`, {
      searchParams: cleanParams
    })
  },

  // Get blood inventory item by ID
  getBloodInventoryItem: (id: string) => {
    return http.get<ApiResponse<BloodInventoryItem>>(`/blood-inventory/${id}`)
  },

  // Update blood inventory item
  updateBloodInventoryItem: (id: string, data: CreateBloodInventoryItemDto) => {
    return http.patch<ApiResponse<BloodInventoryItem>>(`/blood-inventory/${id}`, {
      item: {
        ...(data.bloodType && { bloodType: data.bloodType }),
        ...(data.component && { component: data.component }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.expiresAt && { expiresAt: new Date(data.expiresAt).toISOString() })
      }
    })
  },

  // Delete blood inventory item
  deleteBloodInventoryItem: (id: string) => {
    return http.delete<ApiResponse<void>>(`/blood-inventory/${id}`)
  },

  // Clean up expired blood inventory items
  cleanupExpiredBlood: () => {
    return http.get<ApiResponse<{ deletedCount: number }>>('/blood-inventory/expired/cleanup')
  },

  // ============= Hospital Blood Inventory Management =============

  // Get hospital blood inventory
  getHospitalBloodInventory: (hospitalId: string) => {
    return http.get<ApiResponse<Hospital>>(`/hospitals/${hospitalId}/blood-inventory`)
  },

  // Add item to hospital blood inventory
  addItemToHospitalInventory: (hospitalId: string, data: CreateBloodInventoryItemDto) => {
    return http.post<ApiResponse<BloodInventoryItem>>(`/hospitals/${hospitalId}/blood-inventory`, {
      item: {
        bloodType: data.bloodType,
        component: data.component,
        quantity: data.quantity,
        expiresAt: new Date(data.expiresAt).toISOString()
      }
    })
  },

  // Update entire hospital blood inventory
  updateHospitalBloodInventory: (hospitalId: string, data: UpdateBloodInventoryDto) => {
    return http.put<ApiResponse<Hospital>>(`/hospitals/${hospitalId}/blood-inventory`, data)
  },

  // ============= Helper methods for UI =============

  // Get hospitals with blood inventory details for management table
  getHospitalsWithInventory: (params?: HospitalQueryDto) => {
    // Filter out undefined values to prevent "undefined" strings in query params
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
        )
      : undefined

    return http.get<ApiPaginatedResponse<Hospital>>('/hospitals', {
      searchParams: { ...cleanParams, includeBloodInventory: true }
    })
  },

  // Transform hospital data to table items for UI
  transformToTableItems: (hospitals: Hospital[]): BloodInventoryTableItem[] => {
    const items: BloodInventoryTableItem[] = []

    hospitals.forEach((hospital) => {
      if (hospital.bloodInventory && hospital.bloodInventory.length > 0) {
        hospital.bloodInventory.forEach((item) => {
          const expiryDate = new Date(item.expiresAt)
          const today = new Date()
          const sevenDaysFromNow = new Date()
          sevenDaysFromNow.setDate(today.getDate() + 7)

          items.push({
            _id: item._id,
            hospitalId: hospital._id,
            hospitalName: hospital.name,
            hospitalAddress: hospital.address,
            bloodType: item.bloodType,
            component: item.component,
            quantity: item.quantity,
            expiresAt: item.expiresAt,
            isExpiringSoon: expiryDate <= sevenDaysFromNow && expiryDate > today
          })
        })
      }
    })

    return items
  },

  // Legacy aliases for backwards compatibility
  addBloodInventoryItem: (data: CreateBloodInventoryItemDto & { hospitalId: string }) => {
    return bloodInventoryApi.createBloodInventoryItem(data)
  }
}
