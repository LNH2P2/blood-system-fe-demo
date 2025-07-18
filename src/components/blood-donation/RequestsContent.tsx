'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Clock, Filter, Plus, Heart, AlertTriangle, Zap, Activity, Hospital, User } from 'lucide-react'
import { BloodRequest } from './types'
import { getStatusBadge, getPriorityBadge, getStatusColor } from './utils'
import RequestDetail from './RequestDetail'
import CreateRequestForm from './CreateRequestForm'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDonationRequestsForHospital } from '@/hooks/use-api/use-blood-donation'

interface RequestsContentProps {
  requests: BloodRequest[]
}

interface DonationRequestsResponse {
  status: number
  payload: {
    data: BloodRequest[]
    [key: string]: any
  }
}

// Mapping status enum sang text dễ hiểu
const STATUS_LABELS: Record<number | string, string> = {
  0: 'Chờ xử lý',
  1: 'Hoàn thành',
  2: 'Đã hủy',
  SCHEDULED: 'Chờ xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
}
// Mapping priority sang tiếng Việt và badge
const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Khẩn cấp',
  normal: 'Bình thường',
  'Khẩn cấp': 'Khẩn cấp',
  'Bình thường': 'Bình thường'
}

export default function RequestsContent({ requests: initialRequests }: RequestsContentProps) {
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const { data: donationRequestsData, isLoading: loadingRequests } = useDonationRequestsForHospital(
    priorityFilter === 'all' ? { page: 1, limit: 20 } : { page: 1, limit: 20, priority: priorityFilter }
  )

  useEffect(() => {
    const data = donationRequestsData as DonationRequestsResponse | undefined
    if (data && Array.isArray(data.payload?.data)) {
      setRequests(data.payload.data)
    } else {
      setRequests([])
    }
  }, [donationRequestsData])

  const handleViewDetail = (request: BloodRequest) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedRequest(null)
  }
  // Đổi icon cho từng mức độ priority, dùng màu trắng và drop-shadow cho nổi bật
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Cấp cứu':
        return <Zap className='h-4 w-4 text-white drop-shadow' />
      case 'Khẩn cấp':
        return <AlertTriangle className='h-4 w-4 text-white drop-shadow' />
      default:
        return <Activity className='h-4 w-4 text-white drop-shadow' />
    }
  }

  // Improved priority color scheme for better UI
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cấp cứu':
        return 'border-l-4 border-l-[#e53935] bg-gradient-to-r from-[#ffeaea] to-[#fff5f5]'
      case 'Khẩn cấp':
        return 'border-l-4 border-l-[#ff9800] bg-gradient-to-r from-[#fff4e0] to-[#fff9ed]'
      default:
        return 'border-l-4 border-l-[#1976d2] bg-gradient-to-r from-[#e3f0ff] to-[#f5faff]'
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

  // Thống kê nên dựa trên dữ liệu trả về từ API (đã filter server), không filter client nữa
  const stats = {
    urgent: requests.filter((r) => r.priority === 'Khẩn cấp').length,
    normal: requests.filter((r) => r.priority === 'Bình thường').length,
    processing: requests.filter((r) => r.status === 'Đang xử lý').length,
    completed: requests.filter((r) => r.status === 'Hoàn thành').length
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='border-orange-200 bg-orange-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-600'>Khẩn cấp</p>
                <p className='text-2xl font-bold text-orange-700'>{stats.urgent}</p>
              </div>
              <AlertTriangle className='h-6 w-6 text-orange-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600'>Bình thường</p>
                <p className='text-2xl font-bold text-blue-700'>{stats.normal}</p>
              </div>
              <Activity className='h-6 w-6 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-yellow-200 bg-yellow-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-yellow-600'>Đang xử lý</p>
                <p className='text-2xl font-bold text-yellow-700'>{stats.processing}</p>
              </div>
              <Clock className='h-6 w-6 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-green-200 bg-green-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600'>Hoàn thành</p>
                <p className='text-2xl font-bold text-green-700'>{stats.completed}</p>
              </div>
              <Heart className='h-6 w-6 text-green-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white/20 p-3 rounded-full'>
              <Heart className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Yêu Cầu Hiến Máu</h1>
              <p className='text-red-100 mt-1'>Quản lý và theo dõi các yêu cầu hiến máu khẩn cấp</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Tổng yêu cầu</div>
              <div className='text-2xl font-bold'>{requests.length}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Khẩn cấp</div>
              <div className='text-2xl font-bold text-yellow-300'>{stats.urgent}</div>
            </div>
          </div>
        </div>
      </div>

      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Hospital className='h-5 w-5 text-red-600' />
              <div>
                <CardTitle className='text-gray-800'>Danh sách yêu cầu</CardTitle>
                <CardDescription>Theo dõi tình trạng các yêu cầu hiến máu từ bệnh viện</CardDescription>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className='w-48 border-red-200 focus:border-red-500'>
                  <SelectValue placeholder='Lọc theo mức độ' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value='urgent'>Khẩn cấp</SelectItem>
                  <SelectItem value='normal'>Bình thường</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm' className='border-red-200 text-red-700 hover:bg-red-50'>
                <Filter className='h-4 w-4 mr-2' />
                Lọc
              </Button>
              <Button size='sm' className='bg-red-600 hover:bg-red-700' onClick={() => setIsCreateOpen(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Tạo yêu cầu mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='space-y-1'>
            {requests.map((request, index) => (
              <div
                key={request.id}
                className={`p-6 border-l-4 hover:bg-gray-50/50 hover:shadow-md transition-all duration-200 ${getPriorityColor(
                  PRIORITY_LABELS[request.priority] || request.priority
                )} ${index !== requests.length - 1 ? 'border-b border-gray-100' : ''} group cursor-pointer`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-4 mb-3'>
                      <div className='flex items-center space-x-2'>
                        <div className='transition-transform group-hover:scale-110'>
                          {getPriorityIcon(PRIORITY_LABELS[request.priority] || request.priority)}
                        </div>
                        <div>
                          <h4 className='font-semibold text-lg text-gray-800 group-hover:text-red-600 transition-colors'>
                            {request.hospital}
                          </h4>
                          <span className='text-xs text-gray-500 italic flex items-center mt-1'>
                            <User className='h-3 w-3 mr-1' />
                            Người tạo: {request.createdBy}
                          </span>
                        </div>
                      </div>
                      {/* Priority Badge đẹp hơn với gradient, icon, shadow, tooltip */}
                      <div className='relative group inline-block'>
                        <Badge
                          variant={getPriorityBadge(PRIORITY_LABELS[request.priority] || request.priority)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-white border-0 shadow-md transition-all duration-200
                            ${
                              (PRIORITY_LABELS[request.priority] || request.priority) === 'Cấp cứu'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-400/30 drop-shadow-lg animate-pulse'
                                : (PRIORITY_LABELS[request.priority] || request.priority) === 'Khẩn cấp'
                                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 shadow-orange-400/30 drop-shadow-lg'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-blue-400/30 drop-shadow-lg'
                            }
                          `}
                        >
                          {getPriorityIcon(PRIORITY_LABELS[request.priority] || request.priority)}
                          <span>{PRIORITY_LABELS[request.priority] || request.priority}</span>
                        </Badge>
                        {/* Tooltip giải thích priority */}
                        <span className='absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap'>
                          {(() => {
                            switch (PRIORITY_LABELS[request.priority] || request.priority) {
                              case 'Cấp cứu':
                                return 'Xử lý trong 30 phút (khẩn cấp nhất)'
                              case 'Khẩn cấp':
                                return 'Xử lý trong 2 giờ'
                              default:
                                return 'Xử lý trong 24 giờ'
                            }
                          })()}
                        </span>
                      </div>
                      <Badge
                        variant={getStatusBadge(request.status)}
                        className={`font-medium ${getStatusColor(request.status)}`}
                      >
                        {STATUS_LABELS[request.status] || request.status}
                      </Badge>
                    </div>
                    <div className='grid grid-cols-4 gap-6 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-gray-600'>Nhóm máu:</span>
                        <Badge
                          variant='outline'
                          className={`font-mono font-bold text-sm px-3 py-1 ${getBloodTypeColor(request.bloodType)}`}
                        >
                          {request.bloodType}
                        </Badge>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Heart className='h-4 w-4 text-red-500' />
                        <span className='text-gray-600'>Số lượng:</span>
                        <span className='font-bold text-gray-800'>{request.quantity} ml</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <MapPin className='h-4 w-4 text-blue-500' />
                        <span>{request.location}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Clock className='h-4 w-4 text-green-500' />
                        <span>{request.time}</span>
                      </div>
                    </div>

                    {/* Progress bar for urgent requests */}
                    {(request.priority === 'Cấp cứu' || request.priority === 'Khẩn cấp') && (
                      <div className='mt-3 pt-3 border-t border-gray-200'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-xs text-gray-500'>Mức độ khẩn cấp</span>
                          <span className='text-xs font-medium text-gray-700'>
                            {request.priority === 'Cấp cứu' ? '95%' : '70%'}
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              request.priority === 'Cấp cứu' ? 'bg-red-500 w-[95%]' : 'bg-orange-500 w-[70%]'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='flex items-center space-x-3 ml-6'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all'
                      onClick={() => handleViewDetail(request)}
                    >
                      <Hospital className='h-4 w-4 mr-2' />
                      Chi tiết
                    </Button>
                    <Button
                      size='sm'
                      className={`${
                        request.priority === 'Cấp cứu'
                          ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25'
                          : request.priority === 'Khẩn cấp'
                          ? 'bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-orange-500/25'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                      } font-medium transition-all duration-200 transform hover:scale-105`}
                    >
                      <Heart className='h-4 w-4 mr-2' />
                      Xử lý
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && <RequestDetail request={selectedRequest} isOpen={isDetailOpen} onClose={handleCloseDetail} />}

      {/* Create Request Modal (shadcn Dialog) */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className='max-w-2xl w-full p-0 overflow-hidden'>
          <DialogHeader className='bg-white px-6 py-4 border-b'>
            <DialogTitle className='text-xl font-bold text-red-600 flex items-center gap-2'>
              <Heart className='h-6 w-6' />
              Tạo yêu cầu hiến máu
            </DialogTitle>
          </DialogHeader>
          <div className='bg-gray-50/50'>
            <CreateRequestForm onSubmit={() => setIsCreateOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Information */}
      <Card className='bg-gradient-to-r from-gray-50 to-gray-100 border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                <span>Cấp cứu: Xử lý trong 30 phút</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
                <span>Khẩn cấp: Xử lý trong 2 giờ</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                <span>Bình thường: Xử lý trong 24 giờ</span>
              </div>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-500'>Hệ thống hiến máu quốc gia - Cập nhật thời gian thực</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
