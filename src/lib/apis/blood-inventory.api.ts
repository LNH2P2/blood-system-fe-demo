import http from '@/lib/http'
import { HospitalQueryDto, Hospital, BloodInventoryItem } from '@/types/hospital.d'
import { ApiResponse, ApiPaginatedResponse } from '@/types/response.d'
import {
  BloodInventorySummary,
  CreateBloodInventoryItemDto,
  UpdateBloodInventoryDto,
  AddBloodInventoryDto,
  BloodInventoryTableItem
} from '@/types/blood-inventory.d'

export const bloodInventoryApi = {
  // Get summary across all hospitals
  getSummary: (params?: HospitalQueryDto) => {
    return http.get<ApiResponse<BloodInventorySummary[]>>('/hospitals/blood-inventory/summary', {
      searchParams: params
    })
  },

  // Get hospitals with blood inventory details for management table
  getHospitalsWithInventory: (params?: HospitalQueryDto) => {
    return http.get<ApiPaginatedResponse<Hospital>>('/hospitals', {
      searchParams: { ...params, includeBloodInventory: true }
    })
  },

  // Get blood inventory of a specific hospital
  getHospitalBloodInventory: (hospitalId: string) => {
    return http.get<ApiResponse<Hospital>>(`/hospitals/${hospitalId}/blood-inventory`)
  },

  // Add new blood inventory item to hospital
  addBloodInventoryItem: (hospitalId: string, data: CreateBloodInventoryItemDto) => {
    const formattedData = {
      ...data,
      expiresAt: new Date(data.expiresAt).toISOString()
    }
    return http.post<ApiResponse<Hospital>>(`/hospitals/${hospitalId}/blood-inventory`, {
      item: formattedData
    })
  },

  // Update entire blood inventory of hospital
  updateHospitalBloodInventory: (hospitalId: string, data: UpdateBloodInventoryDto) => {
    return http.put<ApiResponse<Hospital>>(`/hospitals/${hospitalId}/blood-inventory`, data)
  },

  // Helper method to transform hospital data to table items
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

  // Helper method to remove blood inventory item (by updating the entire inventory)
  removeBloodInventoryItem: async (hospitalId: string, itemId: string) => {
    // First get current inventory
    const hospital = await bloodInventoryApi.getHospitalBloodInventory(hospitalId)

    // Filter out the item to remove
    const updatedInventory = hospital.payload.data.bloodInventory.filter(
      (item: BloodInventoryItem) => item._id !== itemId
    )

    // Update the hospital with new inventory
    return bloodInventoryApi.updateHospitalBloodInventory(hospitalId, {
      bloodInventory: updatedInventory
    })
  },

  // Helper method to update specific blood inventory item
  updateBloodInventoryItem: async (hospitalId: string, itemId: string, data: CreateBloodInventoryItemDto) => {
    // First get current inventory
    const hospital = await bloodInventoryApi.getHospitalBloodInventory(hospitalId)

    // Update the specific item
    const updatedInventory = hospital.payload.data.bloodInventory.map((item: BloodInventoryItem) =>
      item._id === itemId ? { ...item, ...data } : item
    )

    // Update the hospital with new inventory
    return bloodInventoryApi.updateHospitalBloodInventory(hospitalId, {
      bloodInventory: updatedInventory
    })
  }
}
