export interface BloodRequest {
  id: number
  hospital: string
  bloodType: string
  quantity: number
  priority: string
  time: string
  status: string
  location: string
  createdBy: string // Thông tin người tạo yêu cầu
}

export interface BloodInventory {
  type: string
  available: number
  status: string
  percentage: number
}

export interface StatData {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: any
  color: string
  bg: string
}

export interface MenuItem {
  id: string
  label: string
  icon: any
  badge?: string
  badgeColor?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'
