import http from '@/lib/http'
import { DonationHistoryResponse } from '@/types/donation'

// Lấy danh sách các yêu cầu hiến máu cho bệnh viện (dùng cho UI RequestDetail)
export async function getDonationRequestsForHospital(params: any) {
  const search = new URLSearchParams(params).toString()
  return http.get(`/donation-requests/findAllHospital?${search}`)
}

// Lấy chi tiết 1 yêu cầu hiến máu
export async function getDonationRequestDetail(id: string) {
  return http.get(`/donation-requests/${id}`)
}

// Tạo mới yêu cầu hiến máu
export async function createDonationRequest(data: any) {
  return http.post('/donation-requests', data)
}

// Lấy danh sách bệnh viện
export async function getAllHospitals(params?: any) {
  const search = params ? '?' + new URLSearchParams(params).toString() : ''
  return http.get(`/hospitals${search}`)
}

export async function getBloodDonationHistory(params?: any) {
  return http.get<DonationHistoryResponse>(`/donation-requests/history-detailed?year${params}`)
}

// 2. Thống kê trạng thái yêu cầu
export async function getRequestStats() {
  return http.get<{ data: { name: string; value: number }[] }>('/donation-requests/request-stats')
}

// 3. Tỷ lệ kết nối theo năm (year optional)
export async function getMatchRate(year?: number) {
  const query = year ? `?year=${year}` : ''
  return http.get<{ data: { name: string; value: number }[] }>(`/donation-requests/match-rate${query}`)
}

// 4. Báo cáo nhu cầu máu
export async function getDemandReport() {
  return http.get<{ data: { name: string; value: number }[] }>('/donation-requests/demand-report')
}

// 5. Báo cáo hiệu suất hệ thống
export async function getPerformanceReport() {
  return http.get<{ data: { name: string; value: number }[] }>('/donation-requests/performance-report')
}

// 6. Báo cáo sự cố
export async function getIncidentReport() {
  return http.get<{ data: { name: string; value: number }[] }>('/donation-requests/incident-report')
}
