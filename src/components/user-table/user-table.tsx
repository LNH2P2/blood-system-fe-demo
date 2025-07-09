// components/UserTable.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

import { formatDate } from '@/hooks/format-date'
import { useGetAllUsers } from '@/hooks/use-api/use-user'
import { debounce } from 'lodash'
import { Button } from '../ui/button'

export default function UserTable() {
  const [search, setSearch] = useState('')
  const [accountType, setAccountType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const buildQueryString = (qs: string, type: string) => {
    const query: Record<string, string> = {}
    if (qs) query['fullName'] = `/${qs}/i`
    if (type) query['accountType'] = type
    return new URLSearchParams(query).toString()
  }

  const { data, isLoading, refetch } = useGetAllUsers({
    current: currentPage,
    limit,
    qs: buildQueryString(search, accountType)
  })

  const debouncedSearch = debounce((val: string) => {
    setCurrentPage(1)
    setSearch(val)
  }, 400)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }
  console.log('UserTable data:', data)

  if (isLoading && !data) {
    return <div>Đang tải......</div>
  }
  return (
    <div className='px-6 py-6 max-w-7xl mx-auto'>
      {data && (
        <Card className='shadow-md border-l-4 border-[#d62828] bg-white rounded-xl'>
          <CardHeader>
            <CardTitle className='text-[#d62828] text-xl'>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
              <Input placeholder='Tìm kiếm theo tên...' onChange={handleSearchChange} className='w-full md:w-1/3' />
              <Select
                onValueChange={(val) => {
                  setCurrentPage(1)
                  setAccountType(val)
                }}
              >
                <SelectTrigger className='w-full md:w-64'>
                  <SelectValue placeholder='Lọc theo loại tài khoản' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sss'>Tất cả</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='donor'>Người hiến</SelectItem>
                  <SelectItem value='hospital'>Bệnh viện</SelectItem>
                </SelectContent>
              </Select>
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
                      <td colSpan={8} className='text-center py-4'>
                        Đang tải...
                      </td>
                    </tr>
                  ) : (
                    data?.payload.data.result &&
                    data.payload.data.result.map((user, idx) => (
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
              {data && data.payload.data.result.length === 0 && (
                <p className='text-sm text-gray-600'>
                  Trang {data?.payload.data.meta.current} / {data?.payload.data.meta.pages} (Tổng:{' '}
                  {data?.payload.data.meta.total})
                </p>
              )}

              <div className='space-x-2'>
                <Button
                  variant='outline'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant='outline'
                  disabled={currentPage === data?.payload.data.meta.pages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
