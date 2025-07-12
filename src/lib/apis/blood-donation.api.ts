import http from '@/lib/http'

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
