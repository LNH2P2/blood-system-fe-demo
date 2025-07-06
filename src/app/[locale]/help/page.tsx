'use client'

import { useState } from 'react'
import NavigationSidebar from '@/components/NavigationSidebar'
import AppHeader from '@/components/AppHeader'
import PlaceholderContent from '@/components/blood-donation/PlaceholderContent'

export default function HelpPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className='flex h-screen bg-gray-50'>
      <NavigationSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <AppHeader
          activeMenu='help'
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <main className='flex-1 overflow-y-auto p-6'>
          <PlaceholderContent />
        </main>
      </div>
    </div>
  )
}
