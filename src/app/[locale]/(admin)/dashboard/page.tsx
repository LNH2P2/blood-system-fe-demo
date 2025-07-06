'use client'

import DashboardContent from '@/components/DashboardContent'
import { AlertTriangle, ClipboardList, UserPlus, Droplets } from 'lucide-react'

export default function DashboardPage() {
  // Mock data
  const stats = [
    {
      title: 'Tổng yêu cầu hôm nay',
      value: '47',
      change: '+12%',
      changeType: 'increase' as const,
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Yêu cầu cấp cứu',
      value: '8',
      change: '+3',
      changeType: 'increase' as const,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Người hiến sẵn sàng',
      value: '156',
      change: '-5%',
      changeType: 'decrease' as const,
      icon: UserPlus,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Đơn vị máu khả dụng',
      value: '1,234',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Droplets,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ]

  const recentRequests = [
    {
      id: 1,
      hospital: 'Bệnh viện Chợ Rẫy',
      bloodType: 'O-',
      quantity: 5,
      priority: 'Cấp cứu',
      time: '2 phút trước',
      status: 'Đang xử lý',
      location: 'TP.HCM'
    },
    {
      id: 2,
      hospital: 'Bệnh viện Bạch Mai',
      bloodType: 'AB+',
      quantity: 3,
      priority: 'Khẩn cấp',
      time: '15 phút trước',
      status: 'Chờ xác nhận',
      location: 'Hà Nội'
    },
    {
      id: 3,
      hospital: 'Bệnh viện Đại học Y Dược',
      bloodType: 'A+',
      quantity: 8,
      priority: 'Bình thường',
      time: '1 giờ trước',
      status: 'Hoàn thành',
      location: 'TP.HCM'
    },
    {
      id: 4,
      hospital: 'Bệnh viện Việt Đức',
      bloodType: 'B-',
      quantity: 2,
      priority: 'Khẩn cấp',
      time: '2 giờ trước',
      status: 'Đang vận chuyển',
      location: 'Hà Nội'
    }
  ]

  const bloodInventory = [
    { type: 'O+', available: 245, status: 'Đủ', percentage: 85 },
    { type: 'A+', available: 198, status: 'Đủ', percentage: 76 },
    { type: 'B+', available: 167, status: 'Trung bình', percentage: 65 },
    { type: 'AB+', available: 89, status: 'Đủ', percentage: 90 },
    { type: 'O-', available: 45, status: 'Thiếu', percentage: 35 },
    { type: 'A-', available: 67, status: 'Thiếu', percentage: 45 },
    { type: 'B-', available: 23, status: 'Thiếu', percentage: 25 },
    { type: 'AB-', available: 12, status: 'Thiếu', percentage: 15 }
  ]

  return <DashboardContent stats={stats} recentRequests={recentRequests} bloodInventory={bloodInventory} />
}
