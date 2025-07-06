import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Clock, Filter, Plus } from 'lucide-react'
import { BloodRequest } from './types'
import { getStatusBadge, getPriorityBadge } from './utils'

interface RequestsContentProps {
  requests: BloodRequest[]
}

export default function RequestsContent({ requests }: RequestsContentProps) {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Danh sách yêu cầu hiến máu</CardTitle>
              <CardDescription>Quản lý tất cả yêu cầu hiến máu trong hệ thống</CardDescription>
            </div>
            <div className='flex items-center space-x-3'>
              <Select>
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Lọc theo mức độ' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value='emergency'>Cấp cứu</SelectItem>
                  <SelectItem value='urgent'>Khẩn cấp</SelectItem>
                  <SelectItem value='normal'>Bình thường</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm'>
                <Filter className='h-4 w-4 mr-2' />
                Lọc
              </Button>
              <Button size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Tạo yêu cầu mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {requests.map((request) => (
              <div key={request.id} className='p-4 border rounded-lg hover:bg-muted/50 transition-colors'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <h4 className='font-semibold'>{request.hospital}</h4>
                      <Badge variant={getPriorityBadge(request.priority)}>{request.priority}</Badge>
                      <Badge variant={getStatusBadge(request.status)}>{request.status}</Badge>
                    </div>
                    <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
                      <span>
                        Nhóm máu:{' '}
                        <Badge variant='outline' className='font-mono ml-1'>
                          {request.bloodType}
                        </Badge>
                      </span>
                      <span>
                        Số lượng: <strong>{request.quantity} đơn vị</strong>
                      </span>
                      <span className='flex items-center'>
                        <MapPin className='h-3 w-3 mr-1' />
                        {request.location}
                      </span>
                      <span className='flex items-center'>
                        <Clock className='h-3 w-3 mr-1' />
                        {request.time}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button variant='outline' size='sm'>
                      Chi tiết
                    </Button>
                    <Button size='sm'>Xử lý</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
