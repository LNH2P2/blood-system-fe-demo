'use client'

import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'
import { useGetBloodInventorySummary } from '@/hooks/use-api/use-blood-inventory'
import { BloodInventoryQueryDto, BloodInventorySummary } from '@/types/blood-inventory.d'
import { BloodInventoryToolbar } from '@/components/blood-inventory/blood-inventory-toolbar'
import { BloodInventoryTable } from '@/components/blood-inventory/blood-inventory-table'
import { columns } from '@/components/blood-inventory/columns'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, BarChart3 } from 'lucide-react'

export default function BloodInventoryPage() {
  const [filters, setFilters] = useState<BloodInventoryQueryDto>({})
  const [debouncedFilters] = useDebounce(filters, 500)

  const { data: summaryData, isLoading, error } = useGetBloodInventorySummary(debouncedFilters)

  const handleReset = () => {
    setFilters({})
  }

  return (
    <div className='container mx-auto py-10 space-y-6'>
      {/* Page Header with Actions */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Blood Inventory Summary</h1>
          <p className='text-muted-foreground'>Overview of blood inventory across all hospitals</p>
        </div>
        <Link href='blood-inventory/management'>
          <Button>
            <Settings className='h-4 w-4 mr-2' />
            Manage Inventory
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Blood Types Available</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summaryData?.length || 0}</div>
            <p className='text-xs text-muted-foreground'>Different blood type/component combinations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Quantity</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {summaryData?.reduce((sum: number, item: BloodInventorySummary) => sum + (item.totalQuantity || 0), 0) ||
                0}
            </div>
            <p className='text-xs text-muted-foreground'>Units available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Hospitals</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {summaryData
                ? new Set(summaryData.flatMap((item: BloodInventorySummary) => item.hospitals.map((h) => h.id))).size
                : 0}
            </div>
            <p className='text-xs text-muted-foreground'>With blood inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='mb-4'>
        <BloodInventoryToolbar filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
      </div>

      {/* Data Table */}
      <div>
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        ) : error ? (
          <div className='text-red-500'>Error: {error.message}</div>
        ) : (
          <BloodInventoryTable columns={columns} data={summaryData ?? []} />
        )}
      </div>
    </div>
  )
}
