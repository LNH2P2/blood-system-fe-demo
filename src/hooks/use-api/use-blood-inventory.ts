import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bloodInventoryApi } from '@/lib/apis/blood-inventory.api'
import { hospitalApi } from '@/lib/apis/hospital.api'
import { CreateBloodInventoryItemDto } from '@/types/blood-inventory.d'
import { HospitalQueryDto } from '@/types/hospital.d'

const bloodInventoryKeys = {
  all: ['blood-inventories'] as const,
  lists: () => [...bloodInventoryKeys.all, 'list'] as const,
  list: (params: HospitalQueryDto) => [...bloodInventoryKeys.lists(), params] as const,
  hospitals: () => [...bloodInventoryKeys.all, 'hospitals'] as const,
  hospital: (id: string) => [...bloodInventoryKeys.hospitals(), id] as const,
  item: (id: string) => [...bloodInventoryKeys.all, 'item', id] as const,
  hospitalInventory: (hospitalId: string) => [...bloodInventoryKeys.hospitals(), hospitalId, 'inventory'] as const
}

// Get blood inventory items (from new API)
export const useGetBloodInventory = (params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: bloodInventoryKeys.list(params),
    queryFn: () => bloodInventoryApi.getBloodInventory(params),
    select: (data) => ({
      items: data.payload.data || [],
      pagination: data.payload.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 }
    })
  })
}

// Get blood inventory for specific hospital (from new API)
export const useGetBloodInventoryByHospital = (hospitalId: string, params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: [...bloodInventoryKeys.hospital(hospitalId), params],
    queryFn: () => bloodInventoryApi.getBloodInventoryByHospital(hospitalId, params),
    select: (data) => ({
      items: data.payload.data || [],
      pagination: data.payload.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 }
    }),
    enabled: !!hospitalId
  })
}

// Get blood inventory summary
export const useGetBloodInventorySummary = (params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: bloodInventoryKeys.list(params),
    queryFn: () => bloodInventoryApi.getBloodInventory(params),
    select: (data) => data.payload.data
  })
}

// Get hospitals with inventory for management
export const useGetHospitalsWithInventory = (params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: ['hospitals-with-inventory', params],
    queryFn: () => bloodInventoryApi.getHospitalsWithInventory(params),
    select: (data) => ({
      hospitals: data.payload.data || [],
      total: data.payload.pagination?.totalRecords || 0,
      tableItems: bloodInventoryApi.transformToTableItems(data.payload.data || [])
    })
  })
}

// Get hospital blood inventory details (from new API)
export const useGetHospitalBloodInventory = (hospitalId: string) => {
  return useQuery({
    queryKey: bloodInventoryKeys.hospitalInventory(hospitalId),
    queryFn: () => bloodInventoryApi.getHospitalBloodInventory(hospitalId),
    select: (data) => data.payload.data,
    enabled: !!hospitalId
  })
}

// Get single blood inventory item
export const useGetBloodInventoryItem = (id: string) => {
  return useQuery({
    queryKey: bloodInventoryKeys.item(id),
    queryFn: () => bloodInventoryApi.getBloodInventoryItem(id),
    select: (data) => data.payload.data,
    enabled: !!id
  })
}

// Add blood inventory item (using new API)
export const useAddBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBloodInventoryItemDto & { hospitalId: string }) =>
      bloodInventoryApi.createBloodInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all })
      toast.success('Blood inventory item added successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to add blood inventory item')
    }
  })
}

// Add blood inventory item to specific hospital
export const useAddItemToHospitalInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ hospitalId, data }: { hospitalId: string; data: CreateBloodInventoryItemDto }) =>
      bloodInventoryApi.addItemToHospitalInventory(hospitalId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.hospitalInventory(variables.hospitalId) })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })
      toast.success('Blood inventory item added to hospital successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to add blood inventory item to hospital')
    }
  })
}

// Update blood inventory item
export const useUpdateBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBloodInventoryItemDto }) =>
      bloodInventoryApi.updateBloodInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all })
      toast.success('Blood inventory item updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update blood inventory item')
    }
  })
}

// Delete blood inventory item
export const useDeleteBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bloodInventoryApi.deleteBloodInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all })
      toast.success('Blood inventory item deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete blood inventory item')
    }
  })
}

// Cleanup expired blood
export const useCleanupExpiredBlood = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => bloodInventoryApi.cleanupExpiredBlood(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.all })
      toast.success(`Cleanup completed: ${data.payload.data.deletedCount} expired items removed`)
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to cleanup expired blood')
    }
  })
}

// Get hospitals for select dropdown
export const useGetHospitalsForSelect = () => {
  return useQuery({
    queryKey: ['hospitals', 'select'],
    queryFn: () => hospitalApi.getHospitals({ limit: 1000 }),
    select: (data) =>
      data.payload.data?.map((hospital) => ({
        value: hospital._id,
        label: `${hospital.name} - ${hospital.address}`
      })) || []
  })
}
