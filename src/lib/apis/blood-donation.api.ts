import http from '@/lib/http'

// Lấy danh sách các yêu cầu hiến máu cho bệnh viện (dùng cho UI RequestDetail)
export async function getDonationRequestsForHospital(params: any) {
  return http.get('/donation-requests/findAllHospital', { params })
}

// Lấy chi tiết 1 yêu cầu hiến máu
export async function getDonationRequestDetail(id: string) {
  return http.get(`/donation-requests/${id}`)
}
