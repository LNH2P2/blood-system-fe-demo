'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  Heart,
  Hospital,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  AlertTriangle,
  Zap,
  Activity,
  Calendar,
  Droplets,
  FileText,
  CheckCircle
} from 'lucide-react'
import { BloodRequest } from './types'
import { getStatusColor, getPriorityBadge } from './utils'

interface RequestDetailProps {
  request: BloodRequest
  isOpen: boolean
  onClose: () => void
}

export default function RequestDetail({ request, isOpen, onClose }: RequestDetailProps) {
  // Helper: status mapping
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'Chờ xác nhận'
      case 'Đã xác nhận':
        return 'Đã xác nhận'
      case 'Hoàn thành':
        return 'Hoàn thành'
      default:
        return 'Không xác định'
    }
  }

  // Helper: status color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Đã xác nhận':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // Helper: format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Cấp cứu':
        return <Zap className='h-5 w-5 text-red-600' />
      case 'Khẩn cấp':
        return <AlertTriangle className='h-5 w-5 text-orange-500' />
      default:
        return <Activity className='h-5 w-5 text-blue-500' />
    }
  }

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800 border-red-300',
      'A-': 'bg-red-200 text-red-900 border-red-400',
      'B+': 'bg-blue-100 text-blue-800 border-blue-300',
      'B-': 'bg-blue-200 text-blue-900 border-blue-400',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-300',
      'AB-': 'bg-purple-200 text-purple-900 border-purple-400',
      'O+': 'bg-green-100 text-green-800 border-green-300',
      'O-': 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
    return colors[bloodType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='overflow-hidden p-0 flex flex-col max-w-lg w-full rounded-xl shadow-xl'
        style={{ maxWidth: '95vw' }}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-5 flex items-center gap-4 rounded-t-xl'>
          <Hospital className='h-10 w-10 text-white bg-white/20 rounded-full p-2' />
          <div className='flex-1'>
            <h2 className='text-2xl font-bold text-white'>{request.hospital || 'Tên bệnh viện'}</h2>
            <div className='text-red-100 text-sm mt-1'>Thời gian yêu cầu: {request.time}</div>
          </div>
          <Badge className={`ml-auto font-semibold border ${getStatusBadgeColor(request.status)}`}>
            {getStatusText(request.status)}
          </Badge>
        </div>
        {/* Main Content */}
        <CardContent className='p-6 space-y-5 bg-white'>
          <div className='flex items-center gap-4'>
            <Badge className={`font-mono text-lg px-4 py-2 border ${getBloodTypeColor(request.bloodType)}`}>
              {request.bloodType}
            </Badge>
            <div className='flex items-center gap-2'>
              <Heart className='h-5 w-5 text-red-500' />
              <span className='text-xl font-bold'>{request.quantity}</span>
              <span className='text-gray-600'>đơn vị</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin className='h-5 w-5 text-blue-500' />
            <span className='text-gray-800'>{request.location}</span>
          </div>
          <div className='flex items-center gap-2'>
            <User className='h-5 w-5 text-purple-500' />
            <span className='text-gray-800'>{request.createdBy}</span>
          </div>
          {request.priority && (
            <div className='flex items-center gap-2'>
              {getPriorityIcon(request.priority)}
              <span className='text-gray-700 font-semibold'>{request.priority}</span>
            </div>
          )}
        </CardContent>
        {/* Footer Actions */}
        <div className='bg-gray-50 p-4 flex justify-end gap-3 border-t rounded-b-xl'>
          <Button variant='outline' onClick={onClose}>
            Đóng
          </Button>
          <Button className='bg-blue-600 hover:bg-blue-700 text-white'>Liên hệ</Button>
          <Button className='bg-red-600 hover:bg-red-700 text-white'>Xử lý ngay</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
