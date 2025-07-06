import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, ChevronRight } from 'lucide-react'
import { BloodRequest } from './types'
import { getStatusBadge, getPriorityBadge } from './utils'

interface RecentRequestsProps {
  requests: BloodRequest[]
}

export default function RecentRequests({ requests }: RecentRequestsProps) {
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Yêu cầu gần đây</CardTitle>
          <Button variant='ghost' size='sm'>
            <ChevronRight className='h-4 w-4' />
            Xem tất cả
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {requests.map((request) => (
            <div key={request.id} className='flex items-center justify-between p-4 bg-muted/50 rounded-lg'>
              <div className='flex-1'>
                <div className='flex items-center space-x-3 mb-2'>
                  <h4 className='font-medium'>{request.hospital}</h4>
                  <Badge variant={getPriorityBadge(request.priority)}>{request.priority}</Badge>
                </div>
                <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                  <Badge variant='outline' className='font-mono'>
                    {request.bloodType}
                  </Badge>
                  <span>{request.quantity} đơn vị</span>
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
              <Badge variant={getStatusBadge(request.status)}>{request.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
