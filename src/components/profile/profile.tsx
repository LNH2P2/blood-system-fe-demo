'use client'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate } from '@/hooks/format-date'
import {
  useCreateUserAddress,
  useDeleteUserAddress,
  useGetUserById,
  useUpdateUser,
  useUpdateUserAddress
} from '@/hooks/use-api/use-user'
import { cn } from '@/lib/utils'
import { addressSchema, updateUserSchema } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useGetUserById(userId)
  const updateUser = useUpdateUser(userId)
  const createAddress = useCreateUserAddress(userId)
  const deleteAddress = useDeleteUserAddress(userId)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  const [editAddressData, setEditAddressData] = useState({
    street: '',
    district: '',
    city: '',
    nation: ''
  })
  const updateAddress = useUpdateUserAddress(userId, editingAddress?._id || '')
  const [newAddressErrors, setNewAddressErrors] = useState<Record<string, string>>({})
  const [editAddressErrors, setEditAddressErrors] = useState<Record<string, string>>({})
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    mode: 'onSubmit'
  })
  const dateOfBirthRaw = form.watch('dateOfBirth')
  const dateOfBirth = dateOfBirthRaw ? new Date(dateOfBirthRaw) : undefined
  const isValidDate = dateOfBirth instanceof Date && !isNaN(dateOfBirth.getTime())

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.payload.data.fullName || '',
        email: user.payload.data.email || '',
        phoneNumber: user.payload.data.phoneNumber || '',
        gender: user.payload.data.gender,
        image: user.payload.data.image || '',
        dateOfBirth: user.payload.data.dateOfBirth
      })
    }
  }, [user, form])

  const onSubmit = async (values: any) => {
    try {
      const original = user?.payload.data as Record<string, any>
      if (!original) return

      // So sánh và lấy ra các trường thay đổi
      const changedValues: Record<string, any> = {}
      for (const key in values) {
        if (values[key] !== original[key]) {
          changedValues[key] = values[key]
        }
      }

      if (Object.keys(changedValues).length === 0) {
        toast.info('Không có thay đổi nào để cập nhật')
        return
      }

      await updateUser.mutateAsync(changedValues)
      setIsEditing(false)
      toast.success('Cập nhật người dùng thành công')
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
      toast.error('Email, số điện thoại đã được sử dụng hoặc có lỗi xảy ra')
    }
  }

  const [newAddress, setNewAddress] = useState({
    street: '',
    district: '',
    city: '',
    nation: ''
  })

  const handleAddAddress = async () => {
    const parsed = addressSchema.safeParse(newAddress)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, any>
      const formattedErrors: Record<string, string> = {}

      Object.keys(fieldErrors).forEach((key) => {
        formattedErrors[key] = fieldErrors[key]?.[0] || ''
      })

      setNewAddressErrors(formattedErrors)
      return
    }

    try {
      await createAddress.mutateAsync(parsed.data)
      setNewAddress({ street: '', district: '', city: '', nation: '' })
      setNewAddressErrors({})
      toast.success('Thêm địa chỉ thành công')
    } catch (error) {
      toast.error('Thêm địa chỉ thất bại')
    }
  }

  const handleEditAddress = (addr: any) => {
    setEditingAddress(addr)
    setEditAddressData({
      street: addr.street || '',
      district: addr.district || '',
      city: addr.city || '',
      nation: addr.nation || ''
    })
  }

  const handleUpdateAddress = async () => {
    const parsed = addressSchema.safeParse(editAddressData)
    if (!parsed.success || !editingAddress) {
      const fieldErrors = parsed.error?.flatten().fieldErrors as Record<string, any>
      const formattedErrors: Record<string, string> = {}

      Object.keys(fieldErrors).forEach((key) => {
        formattedErrors[key] = fieldErrors[key]?.[0] || ''
      })

      setEditAddressErrors(formattedErrors)
      toast.error('Thông tin không hợp lệ')
      return
    }

    try {
      await updateAddress.mutateAsync(parsed.data)
      setEditingAddress(null)
      setEditAddressErrors({})
      toast.success('Cập nhật địa chỉ thành công')
    } catch (err) {
      toast.error('Cập nhật địa chỉ thất bại')
    }
  }
  if (isLoading) {
    return <div className='p-6 max-w-4xl mx-auto'>Đang tải...</div>
  }

  return (
    <>
      <div className='px-4 py-6 max-w-6xl mx-auto space-y-8'>
        <Card className='border shadow-md bg-white rounded-xl'>
          <CardHeader>
            <CardTitle>Hồ sơ người dùng</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <div>
                <Input {...form.register('fullName')} placeholder='Họ và tên' readOnly={!isEditing} />
                {form.formState.errors.fullName && (
                  <p className='text-sm text-red-500'>{form.formState.errors.fullName.message}</p>
                )}
              </div>
              <div>
                <Input {...form.register('email')} placeholder='Email' readOnly={!isEditing} />
                {form.formState.errors.email && (
                  <p className='text-sm text-red-500'>{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Input {...form.register('phoneNumber')} placeholder='Số điện thoại' readOnly={!isEditing} />
                {form.formState.errors.phoneNumber && (
                  <p className='text-sm text-red-500'>{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Select {...form.register('gender')} defaultValue={user?.payload.data.gender} disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue placeholder='Giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Nam</SelectItem>
                    <SelectItem value='female'>Nữ</SelectItem>
                    <SelectItem value='other'>Khác</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className='text-sm text-red-500'>{form.formState.errors.gender.message}</p>
                )}
              </div>

              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn('w-full justify-start text-left', !isValidDate && 'text-muted-foreground')}
                    >
                      {isValidDate ? formatDate(dateOfBirth) : 'Chọn ngày sinh'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='w-auto p-0'>
                    <Calendar
                      className='rounded-md border shadow-sm'
                      captionLayout='dropdown'
                      mode='single'
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        if (date) {
                          form.setValue('dateOfBirth', date.toISOString())
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input readOnly value={isValidDate ? formatDate(dateOfBirth) : ''} />
              )}

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} type='button' className='cursor-pointer'>
                  Chỉnh sửa
                </Button>
              ) : (
                <div className='flex gap-2'>
                  <Button type='submit' className='cursor-pointer' disabled={updateUser.isPending ? true : false}>
                    Lưu thay đổi
                  </Button>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={() => {
                      form.reset(user?.payload.data)
                      setIsEditing(false)
                    }}
                    className='cursor-pointer'
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className='border  shadow-md bg-white rounded-xl'>
          <CardHeader>
            <CardTitle>Quản lý địa chỉ</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {user?.payload.data.address &&
              user.payload.data.address.map((addr) => (
                <div
                  key={addr._id}
                  className='bg-white shadow-sm rounded-lg flex flex-wrap md:flex-nowrap justify-between items-start md:items-center p-4 gap-4'
                >
                  <p className='text-sm text-gray-700 flex-1 min-w-[200px]'>
                    {addr.street}, {addr.district}, {addr.city}, {addr.nation}
                  </p>
                  <div className='flex gap-2 shrink-0'>
                    <Button
                      variant='outline'
                      onClick={() => handleEditAddress(addr)}
                      className='border-gray-300 text-gray-700 hover:bg-gray-100'
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={() => deleteAddress.mutate(addr._id as string)}
                      className='bg-red-600 hover:bg-red-700 text-white'
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}

            <div className='grid gap-2'>
              <Input
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                placeholder='Tên đường'
              />
              {newAddressErrors.street && <p className='text-sm text-red-500'>{newAddressErrors.street}</p>}

              <Input
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                placeholder='Quận/Huyện'
              />
              {newAddressErrors.district && <p className='text-sm text-red-500'>{newAddressErrors.district}</p>}

              <Input
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder='Thành phố'
              />
              {newAddressErrors.city && <p className='text-sm text-red-500'>{newAddressErrors.city}</p>}

              <Input
                value={newAddress.nation}
                onChange={(e) => setNewAddress({ ...newAddress, nation: e.target.value })}
                placeholder='Quốc gia'
              />
              {newAddressErrors.nation && <p className='text-sm text-red-500'>{newAddressErrors.nation}</p>}

              <Button
                onClick={handleAddAddress}
                className='cursor-ponter'
                disabled={createAddress.isPending ? true : false}
              >
                Thêm địa chỉ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingAddress && (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 space-y-4'>
            <h3 className='text-lg font-semibold'>Cập nhật địa chỉ</h3>
            <Input
              value={editAddressData.street}
              onChange={(e) => setEditAddressData({ ...editAddressData, street: e.target.value })}
              placeholder='Tên đường'
            />
            {editAddressErrors.street && <p className='text-sm text-red-500'>{editAddressErrors.street}</p>}
            <Input
              value={editAddressData.district}
              onChange={(e) => setEditAddressData({ ...editAddressData, district: e.target.value })}
              placeholder='Quận/Huyện'
            />
            {editAddressErrors.district && <p className='text-sm text-red-500'>{editAddressErrors.district}</p>}
            <Input
              value={editAddressData.city}
              onChange={(e) => setEditAddressData({ ...editAddressData, city: e.target.value })}
              placeholder='Thành phố'
            />
            {editAddressErrors.city && <p className='text-sm text-red-500'>{editAddressErrors.city}</p>}
            <Input
              value={editAddressData.nation}
              onChange={(e) => setEditAddressData({ ...editAddressData, nation: e.target.value })}
              placeholder='Quốc gia'
            />
            {editAddressErrors.nation && <p className='text-sm text-red-500'>{editAddressErrors.nation}</p>}
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setEditingAddress(null)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateAddress} disabled={updateAddress.isPending}>
                {updateAddress.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
