'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Heart,
  Users,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Menu,
  X,
  Home,
  Droplets,
  UserPlus,
  ClipboardList,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react'

import { MenuItem } from './blood-donation/types'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      badge: undefined
    },
    {
      id: 'requests',
      label: 'Quản lý Yêu cầu',
      icon: ClipboardList,
      badge: '23',
      badgeColor: 'destructive'
    },
    {
      id: 'donors',
      label: 'Người hiến máu',
      icon: Users,
      badge: undefined
    },
    {
      id: 'inventory',
      label: 'Kho máu',
      icon: Droplets,
      badge: '5',
      badgeColor: 'secondary'
    },
    {
      id: 'appointments',
      label: 'Lịch hẹn',
      icon: Calendar,
      badge: undefined
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      icon: BarChart3,
      badge: undefined
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      badge: '12',
      badgeColor: 'default'
    }
  ]

  const bottomMenuItems: MenuItem[] = [
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings
    },
    {
      id: 'help',
      label: 'Trợ giúp',
      icon: HelpCircle
    }
  ]

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col border-r`}
    >
      {/* Logo */}
      <div className='flex items-center justify-between p-4 border-b'>
        <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
          <div className='w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center'>
            <Heart className='h-6 w-6 text-white' />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className='text-lg font-bold text-gray-900'>BloodCare</h1>
              <p className='text-xs text-muted-foreground'>Quản lý hiến máu</p>
            </div>
          )}
        </div>
        <Button variant='ghost' size='sm' onClick={() => setSidebarOpen(!sidebarOpen)} className='p-1.5'>
          {sidebarOpen ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeMenu === item.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${
              activeMenu === item.id ? 'bg-red-50 text-red-700 hover:bg-red-100' : ''
            }`}
            onClick={() => setActiveMenu(item.id)}
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {sidebarOpen && (
              <>
                <span className='flex-1 text-left ml-3'>{item.label}</span>
                {item.badge && (
                  <Badge variant={item.badgeColor as any} className='ml-auto'>
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className='p-4 border-t space-y-2'>
        {bottomMenuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeMenu === item.id ? 'secondary' : 'ghost'}
            className='w-full justify-start'
            onClick={() => setActiveMenu(item.id)}
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {sidebarOpen && <span className='ml-3'>{item.label}</span>}
          </Button>
        ))}

        {/* User Profile */}
        <Separator className='my-4' />
        <div className={`flex items-center space-x-3 px-3 py-2 ${!sidebarOpen && 'justify-center'}`}>
          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
            <User className='h-4 w-4 text-red-600' />
          </div>
          {sidebarOpen && (
            <div className='flex-1'>
              <p className='text-sm font-medium'>Admin User</p>
              <p className='text-xs text-muted-foreground'>admin@bloodcare.com</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <Button variant='ghost' className='w-full justify-start text-muted-foreground'>
            <LogOut className='h-4 w-4' />
            <span className='ml-3'>Đăng xuất</span>
          </Button>
        )}
      </div>
    </div>
  )
}
