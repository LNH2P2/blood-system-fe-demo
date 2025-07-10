import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalApi } from '@/lib/apis/hospital.api';
import { CreateHospitalDto, HospitalQueryDto } from '@/types/hospital';
import { toast } from 'sonner';

const hospitalKeys = {
  all: ['hospitals'] as const,
  lists: () => [...hospitalKeys.all, 'list'] as const,
  list: (query: HospitalQueryDto) => [...hospitalKeys.lists(), query] as const,
  details: () => [...hospitalKeys.all, 'detail'] as const,
  detail: (id: string) => [...hospitalKeys.details(), id] as const,
};

export const useGetHospitals = (query: HospitalQueryDto = {}) => {
  return useQuery({
    queryKey: hospitalKeys.list(query),
    queryFn: () => hospitalApi.getHospitals(query),
  });
};

export const useCreateHospital = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHospital: CreateHospitalDto) => hospitalApi.createHospital(newHospital),
    onSuccess: () => {
      toast('Success', { description: 'Hospital created successfully.' });
      queryClient.invalidateQueries({ queryKey: hospitalKeys.lists() });
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast('Error', { description: err.message });
    },
  });
};
