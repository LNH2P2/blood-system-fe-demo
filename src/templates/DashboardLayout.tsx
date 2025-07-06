'use client'

import { useState, ReactNode } from 'react'
import NavigationSidebar from '@/components/NavigationSidebar'
import AppHeader from '@/components/AppHeader'

interface DashboardLayoutProps {
  children: ReactNode
  activeMenu: string
}

export default function DashboardLayout({ children, activeMenu }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className='flex h-screen bg-gray-50'>
      <NavigationSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <AppHeader
          activeMenu={activeMenu}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  )
}
