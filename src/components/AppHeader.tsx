import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Bell, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  activeMenu: string
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
}

export default function AppHeader({ activeMenu, showNotifications, setShowNotifications }: HeaderProps) {
  const getMenuTitle = (menu: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      requests: 'Quản lý Yêu cầu',
      donors: 'Người hiến máu',
      inventory: 'Kho máu',
      appointments: 'Lịch hẹn',
      reports: 'Báo cáo',
      notifications: 'Thông báo',
      settings: 'Cài đặt',
      home: "BloodCare"
    }
    return titles[menu] || 'Dashboard'
  }

  const getMenuDescription = (menu: string) => {
    const descriptions: { [key: string]: string } = {
      dashboard: 'Tổng quan hệ thống quản lý hiến máu',
      requests: 'Quản lý các yêu cầu hiến máu từ bệnh viện',
      donors: 'Quản lý thông tin người hiến máu',
      inventory: 'Theo dõi tồn kho máu theo nhóm',
      appointments: 'Quản lý lịch hẹn hiến máu',
      reports: 'Báo cáo và thống kê hệ thống',
      notifications: 'Quản lý thông báo hệ thống',
      settings: 'Cấu hình hệ thống',
      home: "Trang giới thiệu hệ thống hiến máu"
    }
    return descriptions[menu] || 'Tổng quan hệ thống quản lý hiến máu'
  }


  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('username')
    if (storedUser) {
      setUsername(storedUser)
    }
  }, [])

  return (
    <header className='bg-white shadow-sm border-b px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{getMenuTitle(activeMenu)}</h1>
          <p className='text-sm text-muted-foreground mt-1'>{getMenuDescription(activeMenu)}</p>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input placeholder='Tìm kiếm...' className='pl-10 w-64' />
          </div>

          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='relative bg-transparent'>
                <Bell className='h-4 w-4' />
                <Badge className='absolute -top-2 -right-2 px-1 min-w-5 h-5' variant='destructive'>
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <div className='p-4 border-b'>
                <h3 className='font-semibold'>Thông báo mới</h3>
              </div>
              <div className='max-h-96 overflow-y-auto'>
                <DropdownMenuItem className='p-4 flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0'></div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Yêu cầu cấp cứu mới</p>
                    <p className='text-xs text-muted-foreground'>Bệnh viện Chợ Rẫy cần 5 đơn vị máu O-</p>
                    <p className='text-xs text-muted-foreground mt-1'>2 phút trước</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='p-4 flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0'></div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Kho máu sắp cạn</p>
                    <p className='text-xs text-muted-foreground'>Nhóm máu AB- chỉ còn 12 đơn vị</p>
                    <p className='text-xs text-muted-foreground mt-1'>15 phút trước</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='p-4 flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Lịch hẹn mới</p>
                    <p className='text-xs text-muted-foreground'>15 người đăng ký hiến máu ngày mai</p>
                    <p className='text-xs text-muted-foreground mt-1'>1 giờ trước</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className='p-3 border-t'>
                <Button variant='ghost' className='w-full text-sm'>
                  Xem tất cả thông báo
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <>
            {activeMenu === 'dashboard' ? (
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Tạo yêu cầu
              </Button>
            ) : (
              <>
                {username ? (
                  <div className='font-semibold text-[#DC2626]'>
                    Xin chào, {username}
                  </div>
                ) : (
                  <>
                    <Link href='/vi/register'>
                      <Button variant='outline' className='mr-2'>
                        Đăng ký
                      </Button>
                    </Link>
                    <Link href='/vi/login'>
                      <Button variant='outline'>
                        Đăng nhập
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </header>
  )
}
