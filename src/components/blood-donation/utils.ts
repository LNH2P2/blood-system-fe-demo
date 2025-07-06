import { BadgeVariant } from './types'

export const getStatusBadge = (status: string): BadgeVariant => {
  const statusMap: { [key: string]: BadgeVariant } = {
    'Hoàn thành': 'default',
    'Đang xử lý': 'secondary',
    'Chờ xác nhận': 'outline',
    'Đang vận chuyển': 'secondary'
  }
  return statusMap[status] || 'default'
}

export const getPriorityBadge = (priority: string): BadgeVariant => {
  const priorityMap: { [key: string]: BadgeVariant } = {
    'Cấp cứu': 'destructive',
    'Khẩn cấp': 'secondary',
    'Bình thường': 'default'
  }
  return priorityMap[priority] || 'default'
}

export const getInventoryBadge = (status: string): BadgeVariant => {
  const statusMap: { [key: string]: BadgeVariant } = {
    Đủ: 'default',
    'Trung bình': 'secondary',
    Thiếu: 'destructive'
  }
  return statusMap[status] || 'default'
}
