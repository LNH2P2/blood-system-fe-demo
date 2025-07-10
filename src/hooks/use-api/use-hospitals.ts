import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalApi } from '@/lib/apis/hospital.api';
import { CreateHospitalDto, HospitalQueryDto, UpdateHospitalDto } from '@/types/hospital';
import { toast } from 'sonner';

const hospitalKeys = {
  all: ['hospitals'] as const,
  lists: () => [...hospitalKeys.all, 'list'] as const,
  list: (params: HospitalQueryDto) => [...hospitalKeys.lists(), params] as const,
};

export const useGetHospitals = (params: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: hospitalKeys.list(params),
    queryFn: () => hospitalApi.getHospitals(params),
  });
};

export const useCreateHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHospitalDto) => hospitalApi.createHospital(data),
    onSuccess: () => {
      toast.success('Hospital created successfully');
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create hospital');
    },
  });
};

export const useUpdateHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHospitalDto }) =>
      hospitalApi.updateHospital(id, data),
    onSuccess: () => {
      toast.success('Hospital updated successfully');
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update hospital');
    },
  });
};

export const useDeleteHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hospitalApi.deleteHospital(id),
    onSuccess: () => {
      toast.success('Hospital deleted successfully');
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete hospital');
    },
  });
};
