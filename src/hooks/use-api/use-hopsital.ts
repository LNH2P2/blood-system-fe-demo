// hooks/useHospitals.ts

import {
  createHospital,
  deleteHospital,
  getHospitalBloodInventory,
  getHospitalById,
  getHospitals,
  getHospitalsName,
  updateHospital
} from '@/apis/hospital.api'
import type { CreateHospitalDto, UpdateHospitalDto } from '@/types/hospital'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetHospitals = (params?: string) => {
  return useQuery({
    queryKey: ['hospitals', params],
    queryFn: () => getHospitals(params)
  })
}

export const useGetHospitalById = (id: string) => {
  return useQuery({
    queryKey: ['hospital', id],
    queryFn: () => getHospitalById(id),
    enabled: !!id // chỉ chạy nếu có id
  })
}

export const useGetHospitalsName = () => {
  return useQuery({
    queryKey: ['hospital-names'],
    queryFn: () => getHospitalsName()
  })
}

export const useCreateHospital = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateHospitalDto) => createHospital(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] })
    }
  })
}

export const useUpdateHospital = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHospitalDto }) => updateHospital(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] })
    }
  })
}

export const useDeleteHospital = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteHospital(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] })
    }
  })
}

export const useGetHospitalBloodInventory = (id: string) => {
  return useQuery({
    queryKey: ['hospital-blood-inventory', id],
    queryFn: () => getHospitalBloodInventory(id),
    enabled: !!id
  })
}
