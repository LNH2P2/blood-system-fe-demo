// components/UserTable.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/hooks/format-date'
import { useGetAllUsers } from '@/hooks/use-api/use-user'
import { accountTypeValues } from '@/types/enum/auth'
import { debounce } from 'lodash'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Loading from '../loading/loading'

export default function UserTable() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialSearch = searchParams.get('search') || ''
  const initialAccountType = searchParams.get('accountType') || ''
  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  const initialLimit = parseInt(searchParams.get('limit') || '10', 10)

  const [search, setSearch] = useState(initialSearch)
  const [accountType, setAccountType] = useState(initialAccountType)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const buildQueryString = (qs: string, type: string) => {
    const query: Record<string, string> = {}
    if (qs) query['fullName'] = `/${qs}/i`
    if (type && type !== 'all') query['accountType'] = type
    return new URLSearchParams(query).toString()
  }

  const { data, isLoading } = useGetAllUsers({
    current: currentPage,
    limit,
    qs: buildQueryString(search, accountType)
  })

  const current = data ? data.payload.data.data.meta.current : 1
  const totalPages = data ? data.payload.data.data.meta.pages : 1

  const updateUrlParams = (search: string, accountType: string, page: number, limit: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (accountType) params.set('accountType', accountType)
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    router.replace(`?${params.toString()}`)
  }

  const debouncedSearch = debounce((val: string) => {
    setSearch(val)
    setCurrentPage(1)
    updateUrlParams(val, accountType, 1, limit)
  }, 400)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleFilterChange = (val: string) => {
    const newType = val === 'all' ? '' : val
    setAccountType(newType)
    setCurrentPage(1)
    updateUrlParams(search, newType, 1, limit)
  }

  const handleResetFilters = () => {
    setSearch('')
    setAccountType('')
    setCurrentPage(1)
    router.replace('?')
  }

  if (isLoading && !data) {
    return <Loading />
  }

  return (
    <div className='px-6 py-6 max-w-7xl mx-auto'>
      {data && (
        <Card className='shadow-md border  bg-white rounded-xl'>
          <CardHeader>
            <CardTitle className='text-[#d62828] text-xl'>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4 items-center'>
              <Input
                placeholder='Tìm kiếm theo tên...'
                onChange={handleSearchChange}
                defaultValue={search}
                className='w-full md:w-1/3'
              />
              <Select onValueChange={handleFilterChange} defaultValue={initialAccountType || 'all'}>
                <SelectTrigger className='w-full md:w-64'>
                  <SelectValue placeholder='Lọc theo phương thức đăng ký' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  {accountTypeValues.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant='outline' onClick={handleResetFilters}>
                Đặt lại bộ lọc
              </Button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full border text-sm text-gray-700'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='px-4 py-2 text-left'>Họ tên</th>
                    <th className='px-4 py-2 text-left'>Tên đăng nhập</th>
                    <th className='px-4 py-2 text-left'>Email</th>
                    <th className='px-4 py-2 text-left'>SĐT</th>
                    <th className='px-4 py-2 text-left'>Giới tính</th>
                    <th className='px-4 py-2 text-left'>Ngày sinh</th>
                    <th className='px-4 py-2 text-left'>Loại tài khoản</th>
                    <th className='px-4 py-2 text-left'>Vai trò</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <Loading />
                    </tr>
                  ) : (
                    data?.payload.data.data.result.map((user, idx) => (
                      <tr key={idx} className='border-t'>
                        <td className='px-4 py-2'>{user.fullName}</td>
                        <td className='px-4 py-2'>{user.username}</td>
                        <td className='px-4 py-2'>{user.email}</td>
                        <td className='px-4 py-2'>{user.phoneNumber}</td>
                        <td className='px-4 py-2 capitalize'>{user.gender}</td>
                        <td className='px-4 py-2'>{formatDate(user.dateOfBirth)}</td>
                        <td className='px-4 py-2 capitalize'>{user.accountType}</td>
                        <td className='px-4 py-2 capitalize'>{user.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className='flex justify-between items-center pt-4'>
              {data.payload.data.data.result.length !== 0 && (
                <p className='text-sm text-gray-600'>
                  Trang {data.payload.data.data.meta.current} / {data.payload.data.data.meta.pages} (Tổng:{' '}
                  {data.payload.data.data.meta.total})
                </p>
              )}
              <div className='space-x-2'>
                <Button
                  variant='outline'
                  disabled={current <= 1}
                  onClick={() => {
                    const newPage = current - 1
                    updateUrlParams(search, accountType, newPage, limit)
                  }}
                >
                  Trước
                </Button>

                <Button
                  variant='outline'
                  disabled={current >= totalPages}
                  onClick={() => {
                    const newPage = current + 1
                    updateUrlParams(search, accountType, newPage, limit)
                  }}
                >
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
