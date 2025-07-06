import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus, Download, RefreshCw } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Tạo yêu cầu mới'
    },
    {
      icon: UserPlus,
      label: 'Thêm người hiến'
    },
    {
      icon: Download,
      label: 'Xuất báo cáo'
    },
    {
      icon: RefreshCw,
      label: 'Đồng bộ dữ liệu'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {actions.map((action, index) => (
            <Button key={index} variant='outline' className='h-20 flex-col space-y-2 bg-transparent'>
              <action.icon className='h-5 w-5' />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
