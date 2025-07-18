import { clsx, type ClassValue } from 'clsx'
import { jwtDecode } from 'jwt-decode'
import { twMerge } from 'tailwind-merge'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { EntityError } from '@/lib/http'

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error('Error', {
      description: error?.payload?.message ?? 'Lỗi không xác định',
      duration: duration ?? 5000
    })
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Delete the first slash of the path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeToken = (token: string) => {
  return jwtDecode(token)
}
