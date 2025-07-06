'use client'

import DashboardLayout from '@/components/DashboardLayout'
import PlaceholderContent from '@/components/blood-donation/PlaceholderContent'

export default function DonorsPage() {
  return (
    <DashboardLayout activeMenu='donors'>
      <PlaceholderContent />
    </DashboardLayout>
  )
}
