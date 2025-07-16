import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bloodInventoryApi } from '@/lib/apis/blood-inventory.api'
import { hospitalApi } from '@/lib/apis/hospital.api'
import { BloodInventoryQueryDto, CreateBloodInventoryItemDto } from '@/types/blood-inventory.d'
import { HospitalQueryDto } from '@/types/hospital.d'

const bloodInventoryKeys = {
  all: ['blood-inventories'] as const,
  lists: () => [...bloodInventoryKeys.all, 'list'] as const,
  list: (params: BloodInventoryQueryDto) => [...bloodInventoryKeys.lists(), params] as const,
  hospitals: () => [...bloodInventoryKeys.all, 'hospitals'] as const,
  hospital: (id: string) => [...bloodInventoryKeys.hospitals(), id] as const
}

export const useGetBloodInventorySummary = (params: BloodInventoryQueryDto = {}) => {
  return useQuery({
    queryKey: bloodInventoryKeys.list(params),
    queryFn: () => bloodInventoryApi.getSummary(params),
    select: (data) => data.payload.data
  })
}

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

export const useGetHospitalBloodInventory = (hospitalId: string) => {
  return useQuery({
    queryKey: bloodInventoryKeys.hospital(hospitalId),
    queryFn: () => bloodInventoryApi.getHospitalBloodInventory(hospitalId),
    select: (data) => data.payload.data,
    enabled: !!hospitalId
  })
}

export const useAddBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ hospitalId, data }: { hospitalId: string; data: CreateBloodInventoryItemDto }) =>
      bloodInventoryApi.addBloodInventoryItem(hospitalId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch hospital inventory
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.hospital(variables.hospitalId) })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })

      toast.success('Blood inventory item added successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to add blood inventory item')
    }
  })
}

export const useUpdateBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      hospitalId,
      itemId,
      data
    }: {
      hospitalId: string
      itemId: string
      data: CreateBloodInventoryItemDto
    }) => bloodInventoryApi.updateBloodInventoryItem(hospitalId, itemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.hospital(variables.hospitalId) })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })

      toast.success('Blood inventory item updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update blood inventory item')
    }
  })
}

export const useRemoveBloodInventoryItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ hospitalId, itemId }: { hospitalId: string; itemId: string }) =>
      bloodInventoryApi.removeBloodInventoryItem(hospitalId, itemId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.hospital(variables.hospitalId) })
      queryClient.invalidateQueries({ queryKey: ['hospitals-with-inventory'] })
      queryClient.invalidateQueries({ queryKey: bloodInventoryKeys.lists() })

      toast.success('Blood inventory item removed successfully')
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to remove blood inventory item')
    }
  })
}

export const useGetHospitalsForSelect = () => {
  return useQuery({
    queryKey: ['hospitals', 'select'],
    queryFn: () => hospitalApi.getHospitals({ limit: 1000 }), // Get all hospitals for select
    select: (data) =>
      data.data.map((hospital) => ({
        value: hospital._id,
        label: `${hospital.name} - ${hospital.address}`
      }))
  })
}
