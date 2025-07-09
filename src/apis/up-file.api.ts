import { BASE_UP_FILE_PATH } from '@/constants/api_url'
import http from '@/lib/http'
import { FileResponse } from '@/types/upfile'

export const uploadLocalFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return http.post<FileResponse>(`${BASE_UP_FILE_PATH}`, formData)
}
