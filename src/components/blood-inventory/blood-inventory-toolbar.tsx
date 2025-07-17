'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BloodInventoryQueryDto } from '@/types/blood-inventory.d'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RotateCcw, AlertTriangle, Clock } from 'lucide-react'

interface BloodInventoryToolbarProps {
  filters: BloodInventoryQueryDto
  onFiltersChange: (filters: BloodInventoryQueryDto) => void
  onReset: () => void
}

const bloodTypes = [
  { value: 'O+', label: 'O+', color: 'text-red-600' },
  { value: 'O-', label: 'O-', color: 'text-red-700' },
  { value: 'A+', label: 'A+', color: 'text-blue-600' },
  { value: 'A-', label: 'A-', color: 'text-blue-700' },
  { value: 'B+', label: 'B+', color: 'text-green-600' },
  { value: 'B-', label: 'B-', color: 'text-green-700' },
  { value: 'AB+', label: 'AB+', color: 'text-purple-600' },
  { value: 'AB-', label: 'AB-', color: 'text-purple-700' }
]

const components = [
  { value: 'whole_blood', label: 'Whole Blood', icon: '🩸' },
  { value: 'red_cells', label: 'Red Blood Cells', icon: '❤️' },
  { value: 'platelets', label: 'Platelets', icon: '🔴' },
  { value: 'plasma', label: 'Plasma', icon: '💛' }
]

const stockStatus = [
  { value: 'low', label: 'Low Stock', icon: <AlertTriangle className='h-4 w-4' /> },
  { value: 'expiring', label: 'Expiring Soon', icon: <Clock className='h-4 w-4' /> },
  { value: 'expired', label: 'Expired', icon: <AlertTriangle className='h-4 w-4 text-red-500' /> }
]

export function BloodInventoryToolbar({ filters, onFiltersChange, onReset }: BloodInventoryToolbarProps) {
  const handleFilterChange = (field: keyof BloodInventoryQueryDto, value: string) => {
    const newFilters = { ...filters }

    if (value === 'all' || value === '') {
      delete newFilters[field]
    } else {
      newFilters[field] = value
    }

    onFiltersChange(newFilters)
  }

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters }
    if (value.trim() === '') {
      delete newFilters.search
    } else {
      newFilters.search = value
    }
    onFiltersChange(newFilters)
  }

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Search blood inventory...'
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Filter Controls */}
      <div className='flex flex-wrap items-center gap-3'>
        {/* Blood Type Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Blood Type:</span>
          <Select value={filters.bloodType || 'all'} onValueChange={(value) => handleFilterChange('bloodType', value)}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='All Types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              {bloodTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <span className={`font-mono font-semibold ${type.color}`}>{type.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Component Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Component:</span>
          <Select value={filters.component || 'all'} onValueChange={(value) => handleFilterChange('component', value)}>
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='All Components' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Components</SelectItem>
              {components.map((comp) => (
                <SelectItem key={comp.value} value={comp.value}>
                  <span className='flex items-center gap-2'>
                    <span>{comp.icon}</span>
                    {comp.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-700'>Status:</span>
          <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='All Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              {stockStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className='flex items-center gap-2'>
                    {status.icon}
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button onClick={onReset} variant='outline' size='sm' className='flex items-center gap-2'>
          <RotateCcw className='h-4 w-4' />
          Reset Filters
        </Button>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-gray-500'>Active filters:</span>
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className='bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1'>
              <span className='font-medium'>{key}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
