'use client'

import { useState, useMemo, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'
import { useGetBloodInventory } from '@/hooks/use-api/use-blood-inventory'
import { HospitalQueryDto, BloodInventoryItem } from '@/types/hospital.d'
import { BloodType } from '@/types/constants'
import { BloodInventoryToolbar } from '@/components/blood-inventory/blood-inventory-toolbar'
import { BloodInventoryTable } from '@/components/blood-inventory/blood-inventory-table'
import { BloodTypeBadge } from '@/components/blood-inventory/blood-type-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Heart,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Package,
  Plus,
  Download,
  Search,
  Filter,
  Clock,
  Shield,
  Activity
} from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { bloodComponentOptions } from '@/validations/blood-inventory'

export default function BloodInventoryPage() {
  const [filters, setFilters] = useState<HospitalQueryDto>({})
  const [debouncedFilters] = useDebounce(filters, 500)
  const [currentTime, setCurrentTime] = useState<string>('')

  const { data: inventoryData, isLoading, error } = useGetBloodInventory(debouncedFilters)

  // Handle time display to avoid hydration errors
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
    }

    updateTime() // Initial call
    const interval = setInterval(updateTime, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Frontend filtering for search and status (since they're not available in backend)
  const filteredData = useMemo(() => {
    if (!inventoryData?.items) return []

    let filtered = inventoryData.items

    // Search filter - search across blood type, component, and any other relevant fields
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.bloodType.toLowerCase().includes(searchLower) ||
          item.component.toLowerCase().includes(searchLower) ||
          // Add more searchable fields as needed
          String(item.quantity).includes(searchLower)
      )
    }

    // Status filter - filter by expiry status and stock levels
    if (filters.status) {
      const today = new Date()
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      filtered = filtered.filter((item) => {
        const expiryDate = new Date(item.expiresAt)

        switch (filters.status) {
          case 'expired':
            return expiryDate <= today
          case 'expiring':
            return expiryDate <= sevenDaysFromNow && expiryDate > today
          case 'low':
            return item.quantity < 10
          case 'critical':
            return item.quantity < 5
          case 'fresh':
            return expiryDate > sevenDaysFromNow
          default:
            return true
        }
      })
    }

    return filtered
  }, [inventoryData?.items, filters.search, filters.status])

  const handleReset = () => {
    setFilters({})
  }

  // Calculate comprehensive summary statistics
  const calculateSummary = () => {
    if (!inventoryData?.items) {
      return {
        bloodTypes: 0,
        totalQuantity: 0,
        totalItems: 0,
        expiringSoon: 0,
        expired: 0,
        bloodTypeDistribution: {},
        componentDistribution: {},
        criticalLow: 0
      }
    }

    const items = filteredData
    const today = new Date()
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Count unique blood type/component combinations
    const uniqueBloodTypes = new Set(items.map((item) => `${item.bloodType}-${item.component}`)).size

    // Calculate total quantity
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

    // Count expiring items
    const expiringSoon = items.filter((item) => {
      const expiryDate = new Date(item.expiresAt)
      return expiryDate <= sevenDaysFromNow && expiryDate > today
    }).length

    // Count expired items
    const expired = items.filter((item) => {
      const expiryDate = new Date(item.expiresAt)
      return expiryDate <= today
    }).length

    // Blood type distribution
    const bloodTypeDistribution = items.reduce((acc, item) => {
      acc[item.bloodType] = (acc[item.bloodType] || 0) + item.quantity
      return acc
    }, {} as Record<string, number>)

    // Component distribution
    const componentDistribution = items.reduce((acc, item) => {
      acc[item.component] = (acc[item.component] || 0) + item.quantity
      return acc
    }, {} as Record<string, number>)

    // Critical low stock (less than 10 units)
    const criticalLow = Object.values(bloodTypeDistribution).filter((quantity) => quantity < 10).length

    return {
      bloodTypes: uniqueBloodTypes,
      totalQuantity,
      totalItems: items.length,
      expiringSoon,
      expired,
      bloodTypeDistribution,
      componentDistribution,
      criticalLow
    }
  }

  const summaryStats = calculateSummary()

  // Create enhanced columns for blood inventory items
  const columns: ColumnDef<BloodInventoryItem>[] = [
    {
      accessorKey: 'bloodType',
      header: 'Blood Type',
      cell: ({ row }) => {
        const bloodType = row.original.bloodType
        return <BloodTypeBadge bloodType={bloodType} size='sm' />
      }
    },
    {
      accessorKey: 'component',
      header: 'Component',
      cell: ({ row }) => {
        const component = row.original.component
        const option = bloodComponentOptions.find((opt) => opt.value === component)

        const getComponentIcon = (comp: string) => {
          switch (comp) {
            case 'whole_blood':
              return <Droplets className='h-3 w-3' />
            case 'red_cells':
              return <Heart className='h-3 w-3' />
            case 'platelets':
              return <Activity className='h-3 w-3' />
            case 'plasma':
              return <Shield className='h-3 w-3' />
            default:
              return <Package className='h-3 w-3' />
          }
        }

        return (
          <Badge variant='secondary' className='flex items-center gap-1'>
            {getComponentIcon(component)}
            {option?.label || component}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => {
        const quantity = row.original.quantity
        const isLowStock = quantity < 10
        const isCriticalStock = quantity < 5

        return (
          <div className='flex items-center gap-2'>
            <div
              className={`p-1 rounded-full ${
                isCriticalStock ? 'bg-red-100' : isLowStock ? 'bg-yellow-100' : 'bg-green-100'
              }`}
            >
              <Droplets
                className={`h-4 w-4 ${
                  isCriticalStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                }`}
              />
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold'>{quantity}</span>
              <span className='text-xs text-muted-foreground'>
                {isCriticalStock ? 'Critical' : isLowStock ? 'Low Stock' : 'In Stock'}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expiry Status',
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt
        const expiryDate = new Date(expiresAt)
        const today = new Date()
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        const isExpired = daysUntilExpiry < 0
        const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 7
        const isExpiringSoonish = daysUntilExpiry > 7 && daysUntilExpiry <= 14

        return (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span
                className={`text-sm font-medium ${
                  isExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-gray-600'
                }`}
              >
                {format(expiryDate, 'MMM dd, yyyy')}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              {isExpired && (
                <Badge variant='destructive' className='text-xs flex items-center gap-1'>
                  <AlertTriangle className='h-3 w-3' />
                  Expired ({Math.abs(daysUntilExpiry)} days ago)
                </Badge>
              )}
              {!isExpired && isExpiringSoon && (
                <Badge variant='outline' className='text-xs text-orange-600 border-orange-600 flex items-center gap-1'>
                  <AlertTriangle className='h-3 w-3' />
                  Expires in {daysUntilExpiry} days
                </Badge>
              )}
              {!isExpired && isExpiringSoonish && (
                <Badge variant='outline' className='text-xs text-yellow-600 border-yellow-600 flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {daysUntilExpiry} days left
                </Badge>
              )}
              {!isExpired && !isExpiringSoon && !isExpiringSoonish && (
                <Badge variant='outline' className='text-xs text-green-600 border-green-600 flex items-center gap-1'>
                  <Shield className='h-3 w-3' />
                  Fresh
                </Badge>
              )}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <div className='space-y-6'>
      {/* Enhanced Gradient Header */}
      <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white/20 p-3 rounded-full'>
              <Droplets className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Quản Lý Kho Máu</h1>
              <p className='text-red-100 mt-1'>Theo dõi và quản lý kho máu tại tất cả các cơ sở y tế</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Cập nhật lần cuối</div>
              <div className='text-lg font-semibold'>{currentTime || '--:--:--'}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Tổng số lượng</div>
              <div className='text-2xl font-bold'>{summaryStats.totalQuantity}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Sắp hết hạn</div>
              <div className='text-2xl font-bold text-yellow-300'>{summaryStats.expiringSoon}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Nguy cấp</div>
              <div className='text-2xl font-bold text-orange-300'>{summaryStats.criticalLow}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className='flex justify-end mt-4 space-x-3'>
          <Link href='blood-inventory/management'>
            <Button size='sm' className='bg-white/20 text-white hover:bg-white/30 border-white/30'>
              <Plus className='h-4 w-4 mr-2' />
              Thêm mẫu máu
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Critical Alerts */}
      {(summaryStats.expired > 0 || summaryStats.criticalLow > 0) && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {summaryStats.expired > 0 && (
            <Card className='border-red-200 bg-red-50 hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-red-600'>Đã hết hạn</p>
                    <p className='text-2xl font-bold text-red-700'>{summaryStats.expired}</p>
                    <p className='text-xs text-red-600 mt-1'>Mẫu máu cần xử lý ngay</p>
                  </div>
                  <div className='bg-red-100 p-3 rounded-full'>
                    <AlertTriangle className='h-6 w-6 text-red-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {summaryStats.criticalLow > 0 && (
            <Card className='border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-orange-600'>Tồn kho thấp</p>
                    <p className='text-2xl font-bold text-orange-700'>{summaryStats.criticalLow}</p>
                    <p className='text-xs text-orange-600 mt-1'>Nhóm máu cần bổ sung</p>
                  </div>
                  <div className='bg-orange-100 p-3 rounded-full'>
                    <TrendingUp className='h-6 w-6 text-orange-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Enhanced Statistics Dashboard */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600'>Tổng đơn vị máu</p>
                <p className='text-2xl font-bold text-blue-700'>{summaryStats.totalQuantity}</p>
                <p className='text-xs text-blue-600 mt-1'>Đơn vị sẵn sàng hiến tặng</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <Droplets className='h-6 w-6 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-green-200 bg-green-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600'>Loại nhóm máu</p>
                <p className='text-2xl font-bold text-green-700'>{summaryStats.bloodTypes}</p>
                <p className='text-xs text-green-600 mt-1'>Các tổ hợp nhóm máu khác nhau</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <Heart className='h-6 w-6 text-green-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-600'>Tổng mẫu máu</p>
                <p className='text-2xl font-bold text-purple-700'>{summaryStats.totalItems}</p>
                <p className='text-xs text-purple-600 mt-1'>Tổng số mục trong kho</p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <Package className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-yellow-600'>Sắp hết hạn</p>
                <p className='text-2xl font-bold text-yellow-700'>{summaryStats.expiringSoon}</p>
                <p className='text-xs text-yellow-600 mt-1'>Mẫu hết hạn trong 7 ngày</p>
              </div>
              <div className='bg-yellow-100 p-3 rounded-full'>
                <Clock className='h-6 w-6 text-yellow-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blood Type Distribution */}
      <Card className='shadow-lg border-0 rounded-lg hover:shadow-xl transition-shadow'>
        <CardHeader className='bg-gradient-to-r from-red-50 to-red-100 p-6'>
          <CardTitle className='flex items-center gap-2 text-red-800'>
            <Heart className='h-5 w-5 text-red-600' />
            Phân phối nhóm máu
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(summaryStats.bloodTypeDistribution).map(([type, quantity]) => (
              <div key={type} className='space-y-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <BloodTypeBadge bloodType={type as BloodType} size='sm' />
                    <span className='font-medium text-gray-700'>{type}</span>
                  </div>
                  <span className='text-sm text-gray-600 font-semibold'>{quantity} đơn vị</span>
                </div>
                <div className='space-y-1'>
                  <Progress value={(quantity / summaryStats.totalQuantity) * 100} className='h-2' />
                  <div className='text-xs text-gray-500 text-right'>
                    {Math.round((quantity / summaryStats.totalQuantity) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Filters */}
      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50 border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Filter className='h-5 w-5 text-red-600' />
              <div>
                <CardTitle className='text-gray-800'>Bộ lọc & Tìm kiếm</CardTitle>
                <p className='text-sm text-gray-600 mt-1'>Lọc và tìm kiếm kho máu theo tiêu chí</p>
              </div>
            </div>
            {Object.keys(filters).length > 0 && (
              <Badge variant='secondary' className='bg-red-100 text-red-800 border-red-300'>
                {filteredData.length} / {inventoryData?.items.length || 0} kết quả
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <BloodInventoryToolbar filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50 border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Search className='h-5 w-5 text-red-600' />
              <div>
                <CardTitle className='text-gray-800'>Danh sách kho máu</CardTitle>
                <p className='text-sm text-gray-600 mt-1'>Quản lý và theo dõi tình trạng kho máu</p>
              </div>
            </div>
            {Object.keys(filters).length > 0 && (
              <Badge variant='secondary' className='bg-blue-100 text-blue-800 border-blue-300'>
                {filteredData.length} / {inventoryData?.items.length || 0} mẫu
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='space-y-4'>
            {isLoading ? (
              <div className='space-y-3 p-6'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
              </div>
            ) : error ? (
              <div className='text-center py-12'>
                <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
                <p className='text-red-600 font-medium'>Lỗi khi tải dữ liệu kho máu</p>
                <p className='text-sm text-red-500 mt-1'>{error.message}</p>
              </div>
            ) : (
              <>
                <div className='overflow-hidden'>
                  <BloodInventoryTable columns={columns} data={filteredData} />
                </div>
                {inventoryData?.pagination && (
                  <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-t'>
                    <div className='text-sm text-gray-600'>
                      Hiển thị trang {inventoryData.pagination.currentPage} / {inventoryData.pagination.totalPages}
                      {Object.keys(filters).length > 0 && (
                        <span className='ml-2 text-blue-600 font-medium'>
                          ({filteredData.length} đã lọc từ {inventoryData.pagination.totalRecords} tổng cộng)
                        </span>
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {Object.keys(filters).length > 0 ? (
                        <span className='text-blue-600 font-medium'>{filteredData.length} mẫu phù hợp</span>
                      ) : (
                        <span>{inventoryData.items.length} mẫu hiển thị</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Information */}
      <Card className='bg-gradient-to-r from-gray-50 to-gray-100 border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span>Tươi: Hạn sử dụng &gt; 7 ngày</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <span>Sắp hết hạn: 3-7 ngày</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
                <span>Nguy hiểm: &lt; 3 ngày</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                <span>Hết hạn: Cần xử lý ngay</span>
              </div>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-500'>Hệ thống quản lý kho máu - Cập nhật thời gian thực</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
