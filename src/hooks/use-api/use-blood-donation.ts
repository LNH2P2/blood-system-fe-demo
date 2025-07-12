// hooks/use-blood-donation.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { createDonationRequest, getAllHospitals, getDonationRequestsForHospital } from '@/lib/apis/blood-donation.api'

// Tạo yêu cầu hiến máu
export const useCreateDonationRequest = () => {
  return useMutation({
    mutationFn: (body: any) => createDonationRequest(body)
  })
}

// Lấy danh sách bệnh viện
export const useGetAllHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: () => getAllHospitals()
  })
}

export const useDonationRequestsForHospital = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ['donation-requests', params],
    queryFn: () => getDonationRequestsForHospital(params)
  })
}

// Có thể bổ sung thêm các hook khác nếu cần, ví dụ: useGetDonationRequests, useUpdateDonationRequest, ...
