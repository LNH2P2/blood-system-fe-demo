import { format } from 'date-fns'

export function formatDate(date: string | Date | undefined, dateFormat = 'dd/MM/yyyy'): string {
  if (!date) return ''

  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date

    if (isNaN(parsedDate.getTime())) return ''

    return format(parsedDate, dateFormat)
  } catch (error) {
    console.error('Lỗi format date:', error)
    return ''
  }
}
