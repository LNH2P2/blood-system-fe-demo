'use client'

import { Button } from '@/components/ui/button'
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
import React from 'react'
import { BLOOD_TYPES } from './CreateRequestForm'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { BloodRequest } from './types'
import { useUpdateDonationRequest } from '@/hooks/use-api/use-blood-donation'

interface RequestDetailProps {
  request: BloodRequest
  isOpen: boolean
  onClose: () => void
}

export default function RequestDetail({ request, isOpen, onClose }: RequestDetailProps) {
  const updateDonationRequestMutation = useUpdateDonationRequest()
  console.log('request', request)
  // Helper: status mapping
  const getStatusText = (status: number | string) => {
    switch (status) {
      case 0:
        return 'Chờ xử lí'
      case 1:
        return 'Đã xác nhận'
      case 2:
        return 'Hoàn thành'
      case 3:
        return 'Không đủ điều kiện'
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

  // Helper to format date for input type='date'
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    // yyyy-MM-dd
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const [form, setForm] = React.useState({
    bloodType: request.bloodType || '',
    quantity: request.quantity || '',
    scheduleDate: request.scheduleDate ? formatDateForInput(request.scheduleDate) : '',
    note: request.note || '',
    priority: request.priority || '',
    status: request.status || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDonationRequestMutation.mutate(
      {
        id: String(request._id),
        body: {
          scheduleDate: form.scheduleDate,
          bloodType: form.bloodType,
          quantity: Number(form.quantity),
          priority: form.priority,
          location: request.location,
          createdBy: request.createdBy,
          status: Number(form.status),
          note: form.note
        }
      },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }

  console.log('request', request)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='overflow-hidden p-0 flex flex-col max-w-lg w-full rounded-2xl shadow-xl border bg-white'
        style={{ maxWidth: '75vw' }}
      >
        {/* Header section with hospital and time */}
        <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex flex-col md:flex-row md:items-center gap-4 rounded-t-2xl shadow relative border-b border-red-200'>
          <div className='flex items-center gap-5'>
            <div className='bg-white/30 rounded-full p-4 shadow-lg flex items-center justify-center'>
              <Hospital className='h-14 w-14 text-white drop-shadow' />
            </div>
            <div>
              <h2 className='text-3xl font-extrabold text-white tracking-tight'>Chỉnh sửa yêu cầu hiến máu</h2>
              <div className='text-red-100 text-sm mt-2 flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                {request.time}
              </div>
            </div>
          </div>
        </div>
        {/* Form section */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left column */}
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <span className='bg-red-100 rounded-full p-2'>
                  <Droplets className='h-5 w-5 text-red-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Nhóm máu</label>
              </div>
              <Select value={form.bloodType} onValueChange={(value) => handleSelectChange('bloodType', value)} required>
                <SelectTrigger className='w-full mt-1.5 min-w-[120px] font-mono text-lg font-bold bg-red-50 focus:ring-2 focus:ring-red-300 transition-all shadow-sm'>
                  <SelectValue placeholder='Chọn nhóm máu' />
                </SelectTrigger>
                <SelectContent className='w-full min-w-[120px]'>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-red-100 rounded-full p-2'>
                  <Heart className='h-5 w-5 text-red-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Số lượng (ml)</label>
              </div>
              <input
                type='number'
                name='quantity'
                value={form.quantity}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 transition-all shadow-sm'
                min={100}
                required
              />
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-purple-100 rounded-full p-2'>
                  <User className='h-5 w-5 text-purple-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Người tạo</label>
              </div>
              <input
                type='text'
                value={request.createdBy}
                readOnly
                className='w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 font-semibold shadow-sm'
              />
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-blue-100 rounded-full p-2'>
                  <MapPin className='h-5 w-5 text-blue-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Địa điểm</label>
              </div>
              <input
                type='text'
                value={request.location}
                readOnly
                className='w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 font-semibold shadow-sm'
              />
            </div>
            {/* Right column */}
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <span className='bg-green-100 rounded-full p-2'>
                  <Calendar className='h-5 w-5 text-green-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Ngày dự kiến</label>
              </div>
              <input
                type='date'
                name='scheduleDate'
                value={form.scheduleDate}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-300 transition-all shadow-sm'
              />
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-gray-200 rounded-full p-2'>
                  <FileText className='h-5 w-5 text-gray-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Ghi chú</label>
              </div>
              <textarea
                name='note'
                value={form.note}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-gray-300 transition-all shadow-sm'
                rows={3}
              />
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-orange-100 rounded-full p-2'>
                  <Zap className='h-5 w-5 text-orange-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Ưu tiên</label>
              </div>
              <select
                name='priority'
                value={form.priority}
                onChange={(e) => handleSelectChange('priority', e.target.value)}
                className='w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 transition-all shadow-sm'
              >
                <option value='Cấp cứu'>Cấp cứu</option>
                <option value='Khẩn cấp'>Khẩn cấp</option>
                <option value='Bình thường'>Bình thường</option>
              </select>
              <div className='flex items-center gap-3 mt-4'>
                <span className='bg-yellow-100 rounded-full p-2'>
                  <Activity className='h-5 w-5 text-yellow-500' />
                </span>
                <label className='block text-gray-700 font-semibold mb-1'>Trạng thái</label>
              </div>
              <select
                name='status'
                value={form.status}
                onChange={(e) => handleSelectChange('status', e.target.value)}
                className='w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300 transition-all shadow-sm'
              >
                <option value={0}>Chờ xử lý</option>
                <option value={1}>Hoàn thành</option>
                <option value={2}>Đã hủy</option>
                <option value={3}>Không đủ điều kiện</option>
              </select>
            </div>
          </div>
          <div className='flex justify-end gap-3 pt-4 border-t mt-6'>
            <Button variant='outline' type='button' onClick={onClose} className='min-w-[100px]'>
              Đóng
            </Button>
            <Button
              type='submit'
              className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white min-w-[120px] shadow-lg font-bold text-base'
            >
              <CheckCircle className='h-4 w-4 mr-1' />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
