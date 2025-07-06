import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BloodInventory } from './types'
import { getInventoryBadge } from './utils'

interface BloodInventorySummaryProps {
  inventory: BloodInventory[]
}

export default function BloodInventorySummary({ inventory }: BloodInventorySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tình trạng kho máu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {inventory.slice(0, 6).map((blood) => (
            <div key={blood.type} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Badge variant='outline' className='font-mono font-bold'>
                  {blood.type}
                </Badge>
                <span className='text-sm text-muted-foreground'>{blood.available} đơn vị</span>
              </div>
              <Badge variant={getInventoryBadge(blood.status)}>{blood.status}</Badge>
            </div>
          ))}
        </div>
        <Button variant='outline' className='w-full mt-4 bg-transparent'>
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  )
}
