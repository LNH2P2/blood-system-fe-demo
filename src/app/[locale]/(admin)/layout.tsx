'use client'

import { ReactNode } from 'react'
import DashboardLayout from '@/templates/DashboardLayout'
import { usePathname } from '../../../i18n/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  // Extract active menu from pathname
  const getActiveMenu = () => {
    if (pathname.includes('/dashboard')) return 'dashboard'
    if (pathname.includes('/requests')) return 'requests'
    if (pathname.includes('/donors')) return 'donors'
    if (pathname.includes('/inventory')) return 'inventory'
    if (pathname.includes('/appointments')) return 'appointments'
    if (pathname.includes('/reports')) return 'reports'
    if (pathname.includes('/notifications')) return 'notifications'
    if (pathname.includes('/settings')) return 'settings'
    if (pathname.includes('/help')) return 'help'
    return 'dashboard'
  }

  return <DashboardLayout activeMenu={getActiveMenu()}>{children}</DashboardLayout>
}
