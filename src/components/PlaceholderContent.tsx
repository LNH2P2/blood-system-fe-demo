import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function PlaceholderContent() {
  return (
    <div className='flex items-center justify-center h-96'>
      <Card className='p-8 text-center'>
        <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
          <Settings className='h-8 w-8 text-muted-foreground' />
        </div>
        <CardTitle className='mb-2'>Tính năng đang phát triển</CardTitle>
        <CardDescription>Module này sẽ được hoàn thiện trong phiên bản tiếp theo.</CardDescription>
      </Card>
    </div>
  )
}
