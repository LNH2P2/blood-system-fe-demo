// hooks/use-blood-donation.ts
import {
  createDonationRequest,
  getAllHospitals,
  getBloodDonationHistory,
  getDemandReport,
  getDonationRequestsForHospital,
  getIncidentReport,
  getMatchRate,
  getPerformanceReport,
  getRequestStats
} from '@/lib/apis/blood-donation.api'
import { useMutation, useQuery } from '@tanstack/react-query'

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

export const useDonationRequestsForHospital = (params: { page: number; limit: number; priority?: string }) => {
  return useQuery({
    queryKey: ['donation-requests', params],
    queryFn: () => getDonationRequestsForHospital(params)
  })
}

// Có thể bổ sung thêm các hook khác nếu cần, ví dụ: useGetDonationRequests, useUpdateDonationRequest, ...
export const useBloodDonationHistory = (year?: number) => {
  return useQuery({
    queryKey: ['blood-donation-history', year],
    queryFn: () => getBloodDonationHistory(year),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

//  Hook lấy thống kê trạng thái yêu cầu
export const useRequestStats = () => {
  return useQuery({
    queryKey: ['request-stats'],
    queryFn: getRequestStats,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook lấy tỷ lệ kết nối theo năm
export const useMatchRate = (year?: number) => {
  return useQuery({
    queryKey: ['match-rate', year],
    queryFn: () => getMatchRate(year),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!year // Nếu muốn chỉ gọi khi có year, hoặc bỏ dòng này để luôn gọi
  })
}

//  Hook lấy báo cáo nhu cầu máu
export const useDemandReport = () => {
  return useQuery({
    queryKey: ['demand-report'],
    queryFn: getDemandReport,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook lấy báo cáo hiệu suất hệ thống
export const usePerformanceReport = () => {
  return useQuery({
    queryKey: ['performance-report'],
    queryFn: getPerformanceReport,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook lấy báo cáo sự cố
export const useIncidentReport = () => {
  return useQuery({
    queryKey: ['incident-report'],
    queryFn: getIncidentReport,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}
