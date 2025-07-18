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
        className='overflow-hidden p-0 flex flex-col h-[90vh]'
        style={{
          maxWidth: '90vw',
          width: '80vw'
        }}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-4 md:p-6 rounded-t-lg flex-shrink-0'>
          <DialogHeader>
            <div className='flex items-center space-x-3 md:space-x-4'>
              <div className='bg-white/20 p-2 md:p-3 rounded-full'>
                <Hospital className='h-6 w-6 md:h-8 md:w-8' />
              </div>
              <div className='text-left'>
                <DialogTitle className='text-xl md:text-2xl font-bold text-white'>{request.hospital}</DialogTitle>
                <DialogDescription className='text-red-100 mt-1 text-sm md:text-base'>
                  Chi tiết yêu cầu hiến máu #{request.id}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6'>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6'>
            {/* Main Info */}
            <div className='xl:col-span-2 space-y-4 md:space-y-6'>
              {/* Priority & Status */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    {getPriorityIcon(request.priority)}
                    <span>Thông tin ưu tiên</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <Badge
                      variant={getPriorityBadge(request.priority)}
                      className={`${
                        request.priority === 'Cấp cứu'
                          ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                          : request.priority === 'Khẩn cấp'
                          ? 'bg-orange-100 text-orange-800 border-orange-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      } font-semibold text-sm md:text-base px-3 py-1 md:px-4 md:py-2`}
                    >
                      {request.priority}
                    </Badge>
                    <Badge
                      className={`font-medium text-sm md:text-base px-3 py-1 md:px-4 md:py-2 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </Badge>
                  </div>

                  {/* Progress for urgent requests */}
                  {(request.priority === 'Cấp cứu' || request.priority === 'Khẩn cấp') && (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Thời gian xử lý tối đa</span>
                        <span className='text-sm font-medium'>
                          {request.priority === 'Cấp cứu' ? '30 phút' : '2 giờ'}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-3'>
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            request.priority === 'Cấp cứu' ? 'bg-red-500 w-[75%]' : 'bg-orange-500 w-[40%]'
                          }`}
                        />
                      </div>
                      <p className='text-xs text-gray-500'>Thời gian đã trôi qua: {request.time}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Blood Request Details */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <Droplets className='h-5 w-5 text-red-600' />
                    <span>Thông tin máu yêu cầu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    <div className='space-y-4'>
                      <div>
                        <label className='text-sm font-medium text-gray-600 block mb-2'>Nhóm máu</label>
                        <Badge
                          variant='outline'
                          className={`font-mono font-bold text-lg px-4 py-2 ${getBloodTypeColor(request.bloodType)}`}
                        >
                          {request.bloodType}
                        </Badge>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-600 block mb-2'>Số lượng cần thiết</label>
                        <div className='flex items-center space-x-2'>
                          <Heart className='h-5 w-5 text-red-500' />
                          <span className='text-2xl font-bold text-gray-800'>{request.quantity}</span>
                          <span className='text-gray-600'>ml</span>
                        </div>
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div>
                        <label className='text-sm font-medium text-gray-600 block mb-2'>Mục đích sử dụng</label>
                        <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>
                          {request.priority === 'Cấp cứu'
                            ? 'Phẫu thuật cấp cứu'
                            : request.priority === 'Khẩn cấp'
                            ? 'Điều trị nội khoa'
                            : 'Dự trữ bệnh viện'}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm font-medium text-gray-600 block mb-2'>Khoa phòng</label>
                        <p className='text-gray-800 bg-gray-50 p-3 rounded-lg'>
                          {request.priority === 'Cấp cứu'
                            ? 'Khoa Cấp Cứu'
                            : request.priority === 'Khẩn cấp'
                            ? 'Khoa Nội'
                            : 'Khoa Truyền Máu'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hospital Contact */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <Hospital className='h-5 w-5 text-blue-600' />
                    <span>Thông tin bệnh viện</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-4'>
                      <div className='flex items-start space-x-3'>
                        <MapPin className='h-5 w-5 text-blue-500 mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium text-gray-600 mb-1'>Địa chỉ</p>
                          <p className='text-gray-800'>{request.location}</p>
                        </div>
                      </div>
                      <div className='flex items-start space-x-3'>
                        <Phone className='h-5 w-5 text-green-500 mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium text-gray-600 mb-1'>Điện thoại</p>
                          <p className='text-gray-800 font-mono'>
                            {request.location === 'TP.HCM' ? '028-3855-4269' : '024-3825-4068'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div className='flex items-start space-x-3'>
                        <User className='h-5 w-5 text-purple-500 mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium text-gray-600 mb-1'>Bác sĩ phụ trách</p>
                          <p className='text-gray-800'>
                            {request.priority === 'Cấp cứu' ? 'BS. Nguyễn Văn An' : 'BS. Trần Thị Bình'}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start space-x-3'>
                        <Mail className='h-5 w-5 text-orange-500 mt-1 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium text-gray-600 mb-1'>Email liên hệ</p>
                          <p className='text-gray-800 text-sm break-all'>
                            blood.request@{request.hospital.toLowerCase().replace(/\s+/g, '')}.vn
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-4 md:space-y-6'>
              {/* Timeline */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <Clock className='h-5 w-5 text-green-600' />
                    <span>Lịch sử xử lý</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-blue-100 p-2 rounded-full flex-shrink-0'>
                        <Calendar className='h-4 w-4 text-blue-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-800'>Yêu cầu được tạo</p>
                        <p className='text-sm text-gray-500'>{request.time}</p>
                      </div>
                    </div>
                    {request.status !== 'Chờ xác nhận' && (
                      <div className='flex items-start space-x-3'>
                        <div className='bg-yellow-100 p-2 rounded-full flex-shrink-0'>
                          <FileText className='h-4 w-4 text-yellow-600' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-800'>Đã xác nhận</p>
                          <p className='text-sm text-gray-500'>5 phút trước</p>
                        </div>
                      </div>
                    )}
                    {request.status === 'Hoàn thành' && (
                      <div className='flex items-start space-x-3'>
                        <div className='bg-green-100 p-2 rounded-full flex-shrink-0'>
                          <CheckCircle className='h-4 w-4 text-green-600' />
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-800'>Hoàn thành</p>
                          <p className='text-sm text-gray-500'>Đã giao máu</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    className={`w-full ${
                      request.priority === 'Cấp cứu'
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                    } transition-all duration-200`}
                  >
                    <Heart className='h-4 w-4 mr-2' />
                    Xử lý yêu cầu
                  </Button>
                  <Button variant='outline' className='w-full hover:bg-gray-50'>
                    <Phone className='h-4 w-4 mr-2' />
                    Liên hệ bệnh viện
                  </Button>
                  <Button variant='outline' className='w-full hover:bg-gray-50'>
                    <FileText className='h-4 w-4 mr-2' />
                    Tải báo cáo
                  </Button>
                </CardContent>
              </Card>

              {/* Important Notes */}
              {request.priority === 'Cấp cứu' && (
                <Card className='border-red-200 bg-red-50 shadow-sm'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-red-700 flex items-center space-x-2 text-lg'>
                      <AlertTriangle className='h-5 w-5' />
                      <span>Lưu ý quan trọng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2 text-sm text-red-700'>
                      <p>• Ưu tiên cao nhất - xử lý ngay lập tức</p>
                      <p>• Thời gian tối đa: 30 phút</p>
                      <p>• Liên hệ trực tiếp bác sĩ phụ trách</p>
                      <p>• Cần xác nhận tình trạng máu có sẵn</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className='border-t bg-gray-50 p-4 md:p-6 flex-shrink-0'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-sm text-gray-500 text-center sm:text-left'>
              Yêu cầu #{request.id} • Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant='outline' onClick={onClose} className='px-6'>
                Đóng
              </Button>
              <Button
                className={`px-6 ${
                  request.priority === 'Cấp cứu'
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                } transition-all duration-200`}
              >
                <Heart className='h-4 w-4 mr-2' />
                Xử lý ngay
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
