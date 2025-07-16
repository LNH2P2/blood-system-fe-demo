'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, X } from 'lucide-react'
import { HospitalQueryDto } from '@/types/hospital.d'
import { bloodTypeOptions, bloodComponentOptions } from '@/validations/blood-inventory'

interface BloodInventoryFiltersProps {
  filters: HospitalQueryDto
  onFiltersChange: (filters: HospitalQueryDto) => void
  onReset: () => void
}

export function BloodInventoryFilters({ filters, onFiltersChange, onReset }: BloodInventoryFiltersProps) {
  const handleFilterChange = (field: keyof HospitalQueryDto, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value === 'all' || value === '' ? undefined : value
    }
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '')

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-center gap-2 mb-4'>
          <Filter className='h-4 w-4' />
          <span className='font-medium'>Filters</span>
          {hasActiveFilters && (
            <Button variant='outline' size='sm' onClick={onReset} className='ml-auto'>
              <X className='h-3 w-3 mr-1' />
              Clear
            </Button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search hospitals...'
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className='pl-9'
            />
          </div>

          {/* Province */}
          <Input
            placeholder='Province/City'
            value={filters.province || ''}
            onChange={(e) => handleFilterChange('province', e.target.value)}
          />

          {/* District */}
          <Input
            placeholder='District'
            value={filters.district || ''}
            onChange={(e) => handleFilterChange('district', e.target.value)}
          />

          {/* Ward */}
          <Input
            placeholder='Ward'
            value={filters.ward || ''}
            onChange={(e) => handleFilterChange('ward', e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {/* Blood Type Filter */}
          <Select value={filters.bloodType || 'all'} onValueChange={(value) => handleFilterChange('bloodType', value)}>
            <SelectTrigger>
              <SelectValue placeholder='All Blood Types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Blood Types</SelectItem>
              {bloodTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Component Filter */}
          <Select value={filters.component || 'all'} onValueChange={(value) => handleFilterChange('component', value)}>
            <SelectTrigger>
              <SelectValue placeholder='All Components' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Components</SelectItem>
              {bloodComponentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Active Status Filter */}
          <Select
            value={filters.isActive !== undefined ? String(filters.isActive) : 'all'}
            onValueChange={(value) => handleFilterChange('isActive', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='All Hospitals' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Hospitals</SelectItem>
              <SelectItem value='true'>Active Only</SelectItem>
              <SelectItem value='false'>Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
