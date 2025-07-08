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

export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'Hoàn thành': 'bg-green-100 text-green-800 border-green-300',
    'Đang xử lý': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Chờ xác nhận': 'bg-blue-100 text-blue-800 border-blue-300',
    'Đang vận chuyển': 'bg-purple-100 text-purple-800 border-purple-300'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
}

export const getInventoryBadge = (status: string): BadgeVariant => {
  const statusMap: { [key: string]: BadgeVariant } = {
    Đủ: 'default',
    'Trung bình': 'secondary',
    Thiếu: 'destructive'
  }
  return statusMap[status] || 'default'
}
