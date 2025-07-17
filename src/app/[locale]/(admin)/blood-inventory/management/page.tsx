'use client'

import { useState, useMemo, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { BloodInventoryFilters } from '@/components/blood-inventory/blood-inventory-filters'
import { BloodInventoryForm } from '@/components/blood-inventory/blood-inventory-form'
import { BloodInventoryDeleteDialog } from '@/components/blood-inventory/blood-inventory-delete-dialog'
import { CleanupExpiredDialog } from '@/components/blood-inventory/cleanup-expired-dialog'
import { useGetHospitalsWithInventory } from '@/hooks/use-api/use-blood-inventory'
import { HospitalQueryDto } from '@/types/hospital.d'
import { BloodInventoryTableItem } from '@/types/blood-inventory.d'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Trash2,
  Building2,
  MoreHorizontal,
  Edit,
  Plus,
  RefreshCw,
  MapPin,
  Droplets,
  Heart,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  Settings
} from 'lucide-react'
import { format } from 'date-fns'
import { bloodTypeOptions, bloodComponentOptions } from '@/validations/blood-inventory'

interface HospitalGroup {
  hospitalId: string
  hospitalName: string
  hospitalAddress: string
  items: BloodInventoryTableItem[]
  totalQuantity: number
  expiredCount: number
  expiringSoonCount: number
}

export default function BloodInventoryManagementPage() {
  const [filters, setFilters] = useState<HospitalQueryDto>({})
  const [debouncedFilters] = useDebounce(filters, 500)
  const [currentTime, setCurrentTime] = useState<string>('')

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<BloodInventoryTableItem | null>(null)

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<BloodInventoryTableItem | null>(null)

  // Cleanup state
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false)

  const { data: inventoryData, isLoading, error, refetch } = useGetHospitalsWithInventory(debouncedFilters)

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

  // Group data by hospital with enhanced statistics
  const groupedData = useMemo(() => {
    if (!inventoryData?.tableItems) return []

    const groups: { [key: string]: HospitalGroup } = {}
    const today = new Date()
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    inventoryData.tableItems.forEach((item) => {
      const key = item.hospitalId
      if (!groups[key]) {
        groups[key] = {
          hospitalId: item.hospitalId,
          hospitalName: item.hospitalName,
          hospitalAddress: item.hospitalAddress,
          items: [],
          totalQuantity: 0,
          expiredCount: 0,
          expiringSoonCount: 0
        }
      }

      groups[key].items.push(item)
      groups[key].totalQuantity += item.quantity

      // Calculate expiry statistics
      const expiryDate = new Date(item.expiresAt)
      if (expiryDate <= today) {
        groups[key].expiredCount++
      } else if (expiryDate <= sevenDaysFromNow) {
        groups[key].expiringSoonCount++
      }
    })

    return Object.values(groups)
  }, [inventoryData?.tableItems])

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (!inventoryData?.tableItems)
      return {
        totalHospitals: 0,
        totalItems: 0,
        totalQuantity: 0,
        totalExpired: 0,
        totalExpiringSoon: 0
      }

    const today = new Date()
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
      totalHospitals: groupedData.length,
      totalItems: inventoryData.tableItems.length,
      totalQuantity: inventoryData.tableItems.reduce((sum, item) => sum + item.quantity, 0),
      totalExpired: inventoryData.tableItems.filter((item) => new Date(item.expiresAt) <= today).length,
      totalExpiringSoon: inventoryData.tableItems.filter((item) => {
        const expiryDate = new Date(item.expiresAt)
        return expiryDate <= sevenDaysFromNow && expiryDate > today
      }).length
    }
  }, [inventoryData?.tableItems, groupedData])

  const handleReset = () => {
    setFilters({})
  }

  const handleAddNew = () => {
    setEditItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: BloodInventoryTableItem) => {
    setEditItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (item: BloodInventoryTableItem) => {
    setDeleteItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleCleanup = () => {
    setIsCleanupDialogOpen(true)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  const handleCleanupSuccess = () => {
    refetch()
  }

  const getBloodTypeBadge = (bloodType: string) => {
    const option = bloodTypeOptions.find((opt) => opt.value === bloodType)
    return (
      <Badge variant='outline' className='font-mono'>
        {option?.label || bloodType}
      </Badge>
    )
  }

  const getComponentBadge = (component: string) => {
    const option = bloodComponentOptions.find((opt) => opt.value === component)
    return <Badge variant='secondary'>{option?.label || component}</Badge>
  }

  const getExpiryStatus = (expiresAt: string, isExpiringSoon: boolean) => {
    const expiryDate = new Date(expiresAt)
    const today = new Date()
    const isExpired = expiryDate < today

    if (isExpired) {
      return <Badge variant='destructive'>Hết hạn</Badge>
    }
    if (isExpiringSoon) {
      return (
        <Badge variant='outline' className='text-orange-600 border-orange-200'>
          Sắp hết hạn
        </Badge>
      )
    }
    return (
      <Badge variant='outline' className='text-green-600 border-green-200'>
        Còn tốt
      </Badge>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Enhanced Gradient Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white/20 p-3 rounded-full'>
              <Settings className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Quản Lý Kho Máu</h1>
              <p className='text-blue-100 mt-1'>Quản lý kho máu tại tất cả các bệnh viện trong hệ thống</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Cập nhật lần cuối</div>
              <div className='text-lg font-semibold'>{currentTime || '--:--:--'}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Tổng bệnh viện</div>
              <div className='text-2xl font-bold'>{overallStats.totalHospitals}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Tổng số lượng</div>
              <div className='text-2xl font-bold'>{overallStats.totalQuantity}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Hết hạn</div>
              <div className='text-2xl font-bold text-red-300'>{overallStats.totalExpired}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className='flex justify-end mt-4 space-x-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAddNew}
            className='border-white/30 text-white hover:bg-white/10'
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm mới
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleCleanup}
            className='border-white/30 text-white hover:bg-white/10'
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Dọn dẹp hết hạn
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            className='border-white/30 text-white hover:bg-white/10'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600'>Bệnh viện</p>
                <p className='text-2xl font-bold text-blue-700'>{overallStats.totalHospitals}</p>
                <p className='text-xs text-blue-600 mt-1'>Tổng số bệnh viện</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <Building2 className='h-6 w-6 text-blue-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-green-200 bg-green-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600'>Tổng số lượng</p>
                <p className='text-2xl font-bold text-green-700'>{overallStats.totalQuantity}</p>
                <p className='text-xs text-green-600 mt-1'>Đơn vị máu trong kho</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <Droplets className='h-6 w-6 text-green-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-600'>Tổng mẫu</p>
                <p className='text-2xl font-bold text-purple-700'>{overallStats.totalItems}</p>
                <p className='text-xs text-purple-600 mt-1'>Số mẫu máu</p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <Package className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-600'>Sắp hết hạn</p>
                <p className='text-2xl font-bold text-orange-700'>{overallStats.totalExpiringSoon}</p>
                <p className='text-xs text-orange-600 mt-1'>Cần xử lý sớm</p>
              </div>
              <div className='bg-orange-100 p-3 rounded-full'>
                <Clock className='h-6 w-6 text-orange-500' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(overallStats.totalExpired > 0 || overallStats.totalExpiringSoon > 5) && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {overallStats.totalExpired > 0 && (
            <Card className='border-red-200 bg-red-50 hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-red-600'>Cảnh báo hết hạn</p>
                    <p className='text-2xl font-bold text-red-700'>{overallStats.totalExpired}</p>
                    <p className='text-xs text-red-600 mt-1'>Mẫu máu đã hết hạn</p>
                  </div>
                  <div className='bg-red-100 p-3 rounded-full'>
                    <AlertTriangle className='h-6 w-6 text-red-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {overallStats.totalExpiringSoon > 5 && (
            <Card className='border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-yellow-600'>Cảnh báo sắp hết hạn</p>
                    <p className='text-2xl font-bold text-yellow-700'>{overallStats.totalExpiringSoon}</p>
                    <p className='text-xs text-yellow-600 mt-1'>Mẫu máu sắp hết hạn</p>
                  </div>
                  <div className='bg-yellow-100 p-3 rounded-full'>
                    <TrendingUp className='h-6 w-6 text-yellow-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Enhanced Filters */}
      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50 border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Settings className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <CardTitle className='text-gray-800'>Bộ lọc & Tìm kiếm</CardTitle>
                <p className='text-sm text-gray-600 mt-1'>Lọc và tìm kiếm dữ liệu kho máu</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <BloodInventoryFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />
        </CardContent>
      </Card>

      {/* Grouped Data Display */}
      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      ) : error ? (
        <div className='text-red-500 text-center py-8'>Error loading blood inventory data: {error.message}</div>
      ) : (
        <div className='space-y-4'>
          {groupedData.length === 0 ? (
            <Card>
              <CardContent className='py-8 text-center text-gray-500'>Không tìm thấy dữ liệu kho máu</CardContent>
            </Card>
          ) : (
            groupedData.map((hospitalGroup) => (
              <Card key={hospitalGroup.hospitalId} className='shadow-lg border-0 hover:shadow-xl transition-shadow'>
                <CardHeader className='bg-gradient-to-r from-gray-50 to-gray-100 border-b'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-blue-100 p-3 rounded-full'>
                        <Building2 className='h-6 w-6 text-blue-600' />
                      </div>
                      <div>
                        <CardTitle className='text-gray-800 text-lg'>{hospitalGroup.hospitalName}</CardTitle>
                        <div className='flex items-center text-sm text-gray-600 mt-1'>
                          <MapPin className='h-4 w-4 mr-1' />
                          {hospitalGroup.hospitalAddress}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <div className='text-center'>
                        <Badge variant='secondary' className='bg-blue-100 text-blue-800 mb-1'>
                          {hospitalGroup.items.length} loại
                        </Badge>
                        <div className='text-xs text-gray-600'>Số loại máu</div>
                      </div>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-green-700'>
                          {hospitalGroup.totalQuantity.toLocaleString()}
                        </div>
                        <div className='text-xs text-gray-600'>Tổng đơn vị</div>
                      </div>
                      {hospitalGroup.expiredCount > 0 && (
                        <div className='text-center'>
                          <div className='text-lg font-bold text-red-600'>{hospitalGroup.expiredCount}</div>
                          <div className='text-xs text-red-600'>Hết hạn</div>
                        </div>
                      )}
                      {hospitalGroup.expiringSoonCount > 0 && (
                        <div className='text-center'>
                          <div className='text-lg font-bold text-orange-600'>{hospitalGroup.expiringSoonCount}</div>
                          <div className='text-xs text-orange-600'>Sắp hết hạn</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nhóm máu</TableHead>
                          <TableHead>Thành phần</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Ngày hết hạn</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className='text-right'>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hospitalGroup.items.map((item) => (
                          <TableRow key={item._id} className='hover:bg-gray-50'>
                            <TableCell>{getBloodTypeBadge(item.bloodType)}</TableCell>
                            <TableCell>{getComponentBadge(item.component)}</TableCell>
                            <TableCell>
                              <span className='font-medium'>{item.quantity.toLocaleString()} đơn vị</span>
                            </TableCell>
                            <TableCell>
                              <span className={item.isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
                                {format(new Date(item.expiresAt), 'dd/MM/yyyy')}
                              </span>
                            </TableCell>
                            <TableCell>{getExpiryStatus(item.expiresAt, item.isExpiringSoon || false)}</TableCell>
                            <TableCell className='text-right'>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Edit className='mr-2 h-4 w-4' />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(item)} className='text-red-600'>
                                    <Trash2 className='mr-2 h-4 w-4' />
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Footer Information */}
      <Card className='bg-gradient-to-r from-gray-50 to-gray-100 border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span>Tốt: Hạn sử dụng còn dài</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <span>Cảnh báo: Sắp hết hạn</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                <span>Nguy hiểm: Đã hết hạn</span>
              </div>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-500'>Hệ thống quản lý kho máu - Cập nhật thời gian thực</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      <BloodInventoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editItem={editItem}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <BloodInventoryDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={deleteItem}
        onSuccess={handleDeleteSuccess}
      />

      {/* Cleanup Expired Dialog */}
      <CleanupExpiredDialog
        open={isCleanupDialogOpen}
        onOpenChange={setIsCleanupDialogOpen}
        onSuccess={handleCleanupSuccess}
      />
    </div>
  )
}
