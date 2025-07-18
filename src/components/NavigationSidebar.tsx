'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthContext } from '@/contexts/auth-context'
import {
  BarChart3,
  Bell,
  Calendar,
  ClipboardList,
  Droplets,
  FileText,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  Hospital,
  X
} from 'lucide-react'

import Link from 'next/link'
import { usePathname, useRouter } from '../i18n/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import Image from 'next/image'

interface MenuItem {
  id: string
  label: string
  icon: any
  badge?: string
  badgeColor?: 'default' | 'secondary' | 'destructive' | 'outline'
  href: string
}

interface NavigationSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function NavigationSidebar({ sidebarOpen, setSidebarOpen }: NavigationSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthContext()
  const menuItems: MenuItem[] = [
    {
      id: 'reports',
      label: 'Báo cáo',
      icon: BarChart3,
      href: '/reports'
    },
    {
      id: 'requests',
      label: 'Quản lý Yêu cầu',
      icon: ClipboardList,
      badge: '23',
      badgeColor: 'destructive',
      href: '/requests'
    },
    {
      id: 'blood-inventory',
      label: 'Kho máu',
      icon: Droplets,
      badge: '5',
      badgeColor: 'secondary',
      href: '/blood-inventory'
    },
    {
      id: 'hospitals',
      label: 'Bệnh viện',
      icon: Hospital,
      href: '/hospitals'
    },
    {
      id: 'blog',
      label: 'Quản lý Blog',
      icon: FileText,
      href: '/blog'
    },
    {
      id: 'management-user',
      label: 'Quản lý người dùng',
      icon: Users,
      badgeColor: 'default',
      href: '/user-table'
    }
  ]

  const bottomMenuItems: MenuItem[] = [
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      href: '/settings'
    },
    {
      id: 'help',
      label: 'Trợ giúp',
      icon: HelpCircle,
      href: '/help'
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    // Handle both /vi/dashboard and /dashboard format
    return pathname === href || pathname.endsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push('/vi/login')
  }
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
            variant={isActive(item.href) ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${isActive(item.href) ? 'bg-red-50 text-red-700 hover:bg-red-100' : ''}`}
            onClick={() => handleNavigation(item.href)}
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
            variant={isActive(item.href) ? 'secondary' : 'ghost'}
            className='w-full justify-start'
            onClick={() => handleNavigation(item.href)}
          >
            <item.icon className='h-5 w-5 flex-shrink-0' />
            {sidebarOpen && <span className='ml-3'>{item.label}</span>}
          </Button>
        ))}

        {/* User Profile */}
        {user && (
          <>
            <Separator className='my-4' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-red-50 rounded-md ${
                    !sidebarOpen && 'justify-center'
                  }`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt='Avatar'
                      width={32}
                      height={32}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                      <User className='h-4 w-4 text-red-600' />
                    </div>
                  )}

                  {sidebarOpen && (
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{user.username || 'Người dùng'}</p>
                      <p className='text-xs text-muted-foreground'>{user.email}</p>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent side='right' align='start' className='w-48'>
                <DropdownMenuItem asChild>
                  <Link href={`/vi/profile/${user.sub}`}>👤 Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/vi/change-password/${user.sub}`}>🔒 Đổi mật khẩu</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {sidebarOpen && (
              <Button
                variant='ghost'
                className='w-full justify-start text-muted-foreground cursor-pointer'
                onClick={handleLogout}
              >
                <LogOut className='h-4 w-4' />
                <span className='ml-3'>Đăng xuất</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
