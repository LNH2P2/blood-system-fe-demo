import { Card, CardContent } from '@/components/ui/card'

import { StatData } from './types'

interface StatCardProps extends StatData {}

export default function StatCard({ title, value, change, changeType, icon: Icon, color, bg }: StatCardProps) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <div className='flex items-center space-x-2 mt-2'>
              <p className='text-3xl font-bold'>{value}</p>
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${bg}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
