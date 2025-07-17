import http from '@/lib/http'
import {
  CreateHospitalDto,
  HospitalResponse,
  HospitalResponseName,
  HospitalResponseOne,
  UpdateHospitalDto
} from '@/types/hospital'

const BASE_HOSPITAL_PATH = '/hospitals'

const createHospital = (data: CreateHospitalDto) => {
  return http.post<HospitalResponse>(`${BASE_HOSPITAL_PATH}`, data)
}

const getHospitals = (param?: string) => {
  const query = new URLSearchParams(param as any).toString()
  return http.get(`${BASE_HOSPITAL_PATH}/${query}`)
}

const getHospitalsName = () => {
  return http.get<HospitalResponseName>(`${BASE_HOSPITAL_PATH}/names`)
}

const getHospitalById = (id: string) => {
  return http.get(`${BASE_HOSPITAL_PATH}/${id}`)
}

const updateHospital = (id: string, data: UpdateHospitalDto) => {
  return http.patch(`${BASE_HOSPITAL_PATH}/${id}`, data)
}
const deleteHospital = (id: string) => {
  return http.delete(`${BASE_HOSPITAL_PATH}/${id}`)
}

const getHospitalBloodInventory = (id: string) => {
  return http.get<HospitalResponseOne>(`${BASE_HOSPITAL_PATH}/${id}/blood-inventory`)
}

export {
  createHospital,
  deleteHospital,
  getHospitalBloodInventory,
  getHospitalById,
  getHospitals,
  getHospitalsName,
  updateHospital
}
