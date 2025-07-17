'use client'

import { Badge } from '@/components/ui/badge'
import { BloodType } from '@/types/constants'

interface BloodTypeBadgeProps {
  bloodType: BloodType
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
}

export function BloodTypeBadge({ bloodType, size = 'md', variant = 'default' }: BloodTypeBadgeProps) {
  const getBloodTypeColor = (type: BloodType) => {
    const colorMap: Record<BloodType, string> = {
      'O+': 'bg-red-500 text-white hover:bg-red-600',
      'O-': 'bg-red-600 text-white hover:bg-red-700',
      'A+': 'bg-blue-500 text-white hover:bg-blue-600',
      'A-': 'bg-blue-600 text-white hover:bg-blue-700',
      'B+': 'bg-green-500 text-white hover:bg-green-600',
      'B-': 'bg-green-600 text-white hover:bg-green-700',
      'AB+': 'bg-purple-500 text-white hover:bg-purple-600',
      'AB-': 'bg-purple-600 text-white hover:bg-purple-700'
    }
    return colorMap[type] || 'bg-gray-500 text-white'
  }

  const getBloodTypeOutlineColor = (type: BloodType) => {
    const colorMap: Record<BloodType, string> = {
      'O+': 'border-red-500 text-red-600 hover:bg-red-50',
      'O-': 'border-red-600 text-red-700 hover:bg-red-50',
      'A+': 'border-blue-500 text-blue-600 hover:bg-blue-50',
      'A-': 'border-blue-600 text-blue-700 hover:bg-blue-50',
      'B+': 'border-green-500 text-green-600 hover:bg-green-50',
      'B-': 'border-green-600 text-green-700 hover:bg-green-50',
      'AB+': 'border-purple-500 text-purple-600 hover:bg-purple-50',
      'AB-': 'border-purple-600 text-purple-700 hover:bg-purple-50'
    }
    return colorMap[type] || 'border-gray-500 text-gray-600'
  }

  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-lg px-4 py-2'
      default:
        return 'text-sm px-3 py-1'
    }
  }

  const colorClass = variant === 'outline' ? getBloodTypeOutlineColor(bloodType) : getBloodTypeColor(bloodType)
  const sizeClass = getSizeClass(size)

  return (
    <Badge variant={variant} className={`font-mono font-bold ${colorClass} ${sizeClass} transition-colors`}>
      {bloodType}
    </Badge>
  )
}
