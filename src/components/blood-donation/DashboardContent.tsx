import StatCard from './StatCard'
import RecentRequests from './RecentRequests'
import BloodInventorySummary from './BloodInventorySummary'
import QuickActions from './QuickActions'
import { ClipboardList, AlertTriangle, UserPlus, Droplets } from 'lucide-react'

interface DashboardContentProps {
  stats: any[]
  recentRequests: any[]
  bloodInventory: any[]
}

export default function DashboardContent({ stats, recentRequests, bloodInventory }: DashboardContentProps) {
  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <RecentRequests requests={recentRequests} />
        <BloodInventorySummary inventory={bloodInventory} />
      </div>

      <QuickActions />
    </div>
  )
}
