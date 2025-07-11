import { useMutation } from '@tanstack/react-query'
import { uploadLocalFile } from '@/apis/up-file.api'

export const useUploadLocalFile = () => {
  return useMutation({
    mutationFn: uploadLocalFile
  })
}
