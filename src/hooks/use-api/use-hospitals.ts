import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hospitalApi } from '@/lib/apis/hospital.api'
import { CreateHospitalDto, HospitalQueryDto, UpdateHospitalDto } from '@/types/hospital.d'
import { toast } from 'sonner'

const hospitalKeys = {
  all: ['hospitals'] as const,
  lists: () => [...hospitalKeys.all, 'list'] as const,
  list: (params: HospitalQueryDto) => [...hospitalKeys.lists(), params] as const,
  detail: (id: string) => [...hospitalKeys.all, 'detail', id] as const
}

export const useGetHospitals = (params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: hospitalKeys.list(params),
    queryFn: () => hospitalApi.getHospitals(params),
    select: (data) => ({
      hospitals: data.payload.data || [],
      pagination: data.payload.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 }
    })
  })
}

export const useGetHospitalById = (id: string) => {
  return useQuery({
    queryKey: hospitalKeys.detail(id),
    queryFn: () => hospitalApi.getHospitalById(id),
    select: (data) => data.payload.data,
    enabled: !!id
  })
}

export const useCreateHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHospitalDto) => hospitalApi.createHospital(data),
    onSuccess: () => {
      toast.success('Hospital created successfully')
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create hospital')
    }
  })
}

export const useUpdateHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHospitalDto }) => hospitalApi.updateHospital(id, data),
    onSuccess: () => {
      toast.success('Hospital updated successfully')
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update hospital')
    }
  })
}

export const useDeleteHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hospitalApi.deleteHospital(id),
    onSuccess: () => {
      toast.success('Hospital deleted successfully')
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete hospital')
    }
  })
}

// Get hospitals for select dropdown
export const useGetHospitalNames = () => {
  return useQuery({
    queryKey: ['hospitals', 'names'],
    queryFn: () => hospitalApi.getHospitalNames(),
    select: (data) => data.payload.data || []
  })
}
