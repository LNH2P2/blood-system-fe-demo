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
        className='overflow-hidden p-0 flex flex-col max-w-lg w-full rounded-2xl shadow-xl border bg-white'
        style={{ maxWidth: '75vw' }}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex flex-col md:flex-row md:items-center gap-4 rounded-t-2xl shadow relative border-b border-red-200'>
          <div className='flex items-center gap-5'>
            <div className='bg-white/30 rounded-full p-4 shadow-lg flex items-center justify-center'>
              <Hospital className='h-14 w-14 text-white drop-shadow' />
            </div>
            <div>
              <h2 className='text-3xl font-extrabold text-white tracking-tight'>
                {request.hospital || 'Tên bệnh viện'}
              </h2>
              <div className='text-red-100 text-sm mt-2 flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                {request.time}
              </div>
            </div>
          </div>
          <div className='flex md:flex-col md:items-end items-center gap-2 md:ml-auto'>
            <Badge
              className={`flex items-center gap-1 font-semibold border text-base px-3 py-1.5 ${getStatusBadgeColor(
                request.status
              )}`}
            >
              <Activity className='h-4 w-4 mr-1' />
              {getStatusText(request.status)}
            </Badge>
            <Badge
              className={`flex items-center gap-1 font-semibold border text-base px-3 py-1.5 ${getPriorityBadge(
                request.priority
              )} mt-0.5`}
            >
              {getPriorityIcon(request.priority)}
              {request.priority}
            </Badge>
          </div>
        </div>
        {/* Main Content */}
        <CardContent className='p-6 bg-white'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left column: blood info */}
            <div className='space-y-6'>
              <div className='flex items-center gap-5'>
                <div
                  className={`rounded-lg border ${getBloodTypeColor(
                    request.bloodType
                  )} flex flex-col items-center justify-center px-6 py-3 shadow font-mono text-2xl font-bold`}
                >
                  {request.bloodType}
                </div>
                <div className='flex items-center gap-2'>
                  <span className='bg-red-100 rounded-full p-1.5'>
                    <Heart className='h-5 w-5 text-red-500' />
                  </span>
                  <span className='text-xl font-bold'>{request.quantity}</span>
                  <span className='text-gray-500'>đơn vị</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span className='bg-blue-100 rounded-full p-1.5'>
                  <MapPin className='h-5 w-5 text-blue-500' />
                </span>
                <span className='text-gray-800 font-medium'>{request.location}</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='bg-green-100 rounded-full p-1.5'>
                  <Calendar className='h-5 w-5 text-green-500' />
                </span>
                <span className='text-gray-800'>
                  Ngày dự kiến:{' '}
                  <span className='font-semibold'>{request.scheduleDate ? formatDate(request.scheduleDate) : '-'}</span>
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='bg-purple-100 rounded-full p-1.5'>
                  <User className='h-5 w-5 text-purple-500' />
                </span>
                <span className='text-gray-800'>
                  Người tạo: <span className='font-semibold'>{request.createdBy}</span>
                </span>
              </div>
            </div>
            {/* Right column: priority, note, contact */}
            <div className='space-y-6'>
              {/* Progress bar cho ưu tiên */}
              {(request.priority === 'Cấp cứu' || request.priority === 'Khẩn cấp') && (
                <div className='mt-2'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs text-gray-500'>Mức độ khẩn cấp</span>
                    <span className='text-xs font-medium text-gray-700'>
                      {request.priority === 'Cấp cứu' ? '95%' : '70%'}
                    </span>
                  </div>
                  <div className='w-full bg-gradient-to-r from-red-200 via-orange-200 to-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        request.priority === 'Cấp cứu'
                          ? 'bg-gradient-to-r from-red-500 to-red-400 w-[95%]'
                          : 'bg-gradient-to-r from-orange-500 to-orange-400 w-[70%]'
                      }`}
                    />
                  </div>
                </div>
              )}
              {/* Ghi chú */}
              {request.note && (
                <div className='flex items-start gap-3 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100'>
                  <span className='bg-gray-200 rounded-full p-1.5'>
                    <FileText className='h-5 w-5 text-gray-500' />
                  </span>
                  <div>
                    <div className='text-gray-700 font-semibold mb-1 text-sm'>Ghi chú</div>
                    <div className='text-gray-600 text-sm whitespace-pre-line'>{request.note}</div>
                  </div>
                </div>
              )}
              {/* Liên hệ (giả lập) */}
              <div className='flex items-center gap-3'>
                <span className='bg-blue-100 rounded-full p-1.5'>
                  <Phone className='h-5 w-5 text-blue-500' />
                </span>
                <span className='text-gray-700 text-sm'>
                  SĐT: <span className='font-semibold'>{request.phone || '---'}</span>
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='bg-blue-100 rounded-full p-1.5'>
                  <Mail className='h-5 w-5 text-blue-500' />
                </span>
                <span className='text-gray-700 text-sm'>
                  Email: <span className='font-semibold'>{request.email || '---'}</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        {/* Footer Actions */}
        <div className='bg-gray-50 p-4 flex flex-col md:flex-row justify-end gap-3 border-t rounded-b-2xl'>
          <Button variant='outline' onClick={onClose} className='min-w-[100px]'>
            Đóng
          </Button>
          <Button className='bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] flex items-center gap-2 shadow-md'>
            <Phone className='h-4 w-4' />
            Liên hệ
          </Button>
          <Button className='bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white min-w-[120px] flex items-center gap-2 shadow-lg font-bold text-base'>
            <CheckCircle className='h-4 w-4' />
            Xử lý ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}