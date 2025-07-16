'use client'

import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useGetHospitals, useCreateHospital, useDeleteHospital } from '@/hooks/use-api/use-hospitals'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PlusCircle,
  Hospital,
  MapPin,
  Phone,
  Clock,
  Building2,
  Activity,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { HospitalForm } from '@/components/hospital/hospital-form'
import { HospitalToolbar } from '../../../../components/hospital/hospital-toolbar'
import { EditHospitalDialog } from '../../../../components/hospital/edit-hospital-dialog'
import { ConfirmationDialog } from '@/components/common/confirmation-dialog'
import { CreateHospitalDto, Hospital as HospitalType, UpdateHospitalDto } from '@/types/hospital'

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingHospital, setEditingHospital] = useState<HospitalType | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingHospital, setDeletingHospital] = useState<HospitalType | null>(null)

  const {
    data: hospitalsData,
    isLoading,
    error
  } = useGetHospitals({
    search: debouncedSearchTerm,
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'true' })
  })

  const createHospitalMutation = useCreateHospital(() => {
    setIsAddDialogOpen(false)
  })

  const deleteHospitalMutation = useDeleteHospital(() => {
    setIsDeleteDialogOpen(false)
  })

  const handleCreateHospital = (data: CreateHospitalDto | UpdateHospitalDto) => {
    createHospitalMutation.mutate(data as CreateHospitalDto)
  }

  if (error) return <div>An error occurred: {error.message}</div>

  const hospitals = hospitalsData?.data || []

  const handleEditClick = (hospital: HospitalType) => {
    setEditingHospital(hospital)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (hospital: HospitalType) => {
    setDeletingHospital(hospital)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingHospital) {
      deleteHospitalMutation.mutate(deletingHospital._id)
    }
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  // Calculate statistics
  const getStats = () => {
    const total = hospitals.length
    const active = hospitals.filter((h) => h.isActive).length
    const inactive = hospitals.filter((h) => !h.isActive).length
    const withInventory = hospitals.filter((h) => h.bloodInventory && h.bloodInventory.length > 0).length
    const recentlyAdded = hospitals.filter((h) => {
      const createdDate = new Date(h.createdAt || Date.now())
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdDate >= weekAgo
    }).length

    return { total, active, inactive, withInventory, recentlyAdded }
  }

  const stats = getStats()

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600'>Tổng số</p>
                <p className='text-2xl font-bold text-blue-700'>{stats.total}</p>
              </div>
              <Building2 className='h-6 w-6 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-green-200 bg-green-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600'>Hoạt động</p>
                <p className='text-2xl font-bold text-green-700'>{stats.active}</p>
              </div>
              <CheckCircle className='h-6 w-6 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-red-200 bg-red-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-red-600'>Tạm dừng</p>
                <p className='text-2xl font-bold text-red-700'>{stats.inactive}</p>
              </div>
              <XCircle className='h-6 w-6 text-red-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-purple-200 bg-purple-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-purple-600'>Có kho máu</p>
                <p className='text-2xl font-bold text-purple-700'>{stats.withInventory}</p>
              </div>
              <Activity className='h-6 w-6 text-purple-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-orange-200 bg-orange-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-orange-600'>Thêm gần đây</p>
                <p className='text-2xl font-bold text-orange-700'>{stats.recentlyAdded}</p>
              </div>
              <Clock className='h-6 w-6 text-orange-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white/20 p-3 rounded-full'>
              <Hospital className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Quản lý Bệnh viện</h1>
              <p className='text-blue-100 mt-1'>Quản lý thông tin và hoạt động của các bệnh viện trong hệ thống</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Cập nhật lần cuối</div>
              <div className='text-lg font-semibold'>
                {new Date().toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Tổng bệnh viện</div>
              <div className='text-2xl font-bold'>{stats.total}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-blue-100'>Đang hoạt động</div>
              <div className='text-2xl font-bold text-green-300'>{stats.active}</div>
            </div>
          </div>
        </div>
      </div>

      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Building2 className='h-5 w-5 text-blue-600' />
              <div>
                <CardTitle className='text-gray-800'>Danh sách bệnh viện</CardTitle>
                <CardDescription>Theo dõi và quản lý thông tin các bệnh viện</CardDescription>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <HospitalToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                onReset={handleReset}
              />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Thêm bệnh viện
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[625px]'>
                  <DialogHeader>
                    <DialogTitle>Thêm bệnh viện mới</DialogTitle>
                    <DialogDescription>Điền thông tin chi tiết để thêm bệnh viện mới vào hệ thống.</DialogDescription>
                  </DialogHeader>
                  <HospitalForm onSubmit={handleCreateHospital} isSubmitting={createHospitalMutation.isPending} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-500'>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className='space-y-1'>
              {hospitals.map((hospital, index) => (
                <div
                  key={hospital._id}
                  className={`p-6 border-l-4 hover:bg-gray-50/50 hover:shadow-md transition-all duration-200 ${
                    hospital.isActive ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'
                  } ${index !== hospitals.length - 1 ? 'border-b border-gray-100' : ''} group cursor-pointer`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-4 mb-3'>
                        <div className='flex items-center space-x-2'>
                          <div className='transition-transform group-hover:scale-110'>
                            <Hospital className={`h-5 w-5 ${hospital.isActive ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <h4 className='font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors'>
                            {hospital.name}
                          </h4>
                        </div>
                        <Badge
                          variant={hospital.isActive ? 'default' : 'destructive'}
                          className={`font-semibold ${
                            hospital.isActive
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {hospital.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                        {hospital.bloodInventory && hospital.bloodInventory.length > 0 && (
                          <Badge
                            variant='outline'
                            className='bg-purple-100 text-purple-800 border-purple-300 font-medium'
                          >
                            Có kho máu
                          </Badge>
                        )}
                      </div>
                      <div className='grid grid-cols-3 gap-6 text-sm'>
                        <div className='flex items-center space-x-2'>
                          <MapPin className='h-4 w-4 text-blue-500' />
                          <span className='text-gray-600'>{hospital.address}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Phone className='h-4 w-4 text-green-500' />
                          <span className='text-gray-600'>
                            {hospital.contactInfo?.phone || 'Chưa có số điện thoại'}
                          </span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Users className='h-4 w-4 text-purple-500' />
                          <span className='text-gray-600'>{hospital.bloodInventory?.length || 0} loại máu</span>
                        </div>
                      </div>

                      {/* Inventory summary for hospitals with blood inventory */}
                      {hospital.bloodInventory && hospital.bloodInventory.length > 0 && (
                        <div className='mt-3 pt-3 border-t border-gray-200'>
                          <div className='flex items-center justify-between mb-2'>
                            <span className='text-xs text-gray-500'>Tồn kho máu</span>
                            <span className='text-xs font-medium text-gray-700'>
                              {hospital.bloodInventory.reduce((sum, item) => sum + item.quantity, 0)} đơn vị
                            </span>
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {hospital.bloodInventory.slice(0, 4).map((item, idx) => (
                              <Badge
                                key={idx}
                                variant='outline'
                                className='text-xs bg-blue-50 text-blue-700 border-blue-200'
                              >
                                {item.bloodType}: {item.quantity}
                              </Badge>
                            ))}
                            {hospital.bloodInventory.length > 4 && (
                              <Badge variant='outline' className='text-xs bg-gray-50 text-gray-600'>
                                +{hospital.bloodInventory.length - 4} khác
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='flex items-center space-x-3 ml-6'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all'
                        onClick={() => handleEditClick(hospital)}
                      >
                        <Building2 className='h-4 w-4 mr-2' />
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25 font-medium transition-all duration-200 transform hover:scale-105'
                        onClick={() => handleDeleteClick(hospital)}
                      >
                        <XCircle className='h-4 w-4 mr-2' />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditHospitalDialog
        hospital={editingHospital}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Xóa ${deletingHospital?.name}`}
        description='Bạn có chắc chắn muốn xóa bệnh viện này? Hành động này không thể hoàn tác.'
        isConfirming={deleteHospitalMutation.isPending}
      />

      {/* Footer Information */}
      <Card className='bg-gradient-to-r from-gray-50 to-gray-100 border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span>Hoạt động: Bệnh viện đang vận hành bình thường</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <span>Tạm dừng: Bệnh viện tạm ngừng hoạt động</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-purple-500 rounded-full'></div>
                <span>Có kho máu: Bệnh viện có dữ liệu tồn kho</span>
              </div>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-500'>Hệ thống quản lý bệnh viện - Cập nhật thời gian thực</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
