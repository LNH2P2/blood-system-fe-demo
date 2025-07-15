// components/UserTable.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/hooks/format-date'
import { useGetAllUsers } from '@/hooks/use-api/use-user'
import getPageList from '@/lib/getPageList'
import { debounce } from 'lodash'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from '../../i18n/navigation'
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

  useEffect(() => {
    // bất cứ khi nào searchParams thay đổi (nút back/forward)
    const sp = new URLSearchParams(window.location.search)
    setCurrentPage(parseInt(sp.get('page') || '1', 10))
    setSearch(sp.get('search') || '')
    setAccountType(sp.get('accountType') || '')
    setLimit(parseInt(sp.get('limit') || '10', 10))
  }, [searchParams])
  const buildQueryString = (search: string, type: string) => {
    const filter: Record<string, any> = {}

    // a) tìm theo tên hoặc số điện thoại
    if (search) {
      filter.$or = [{ fullName: { $regex: search, $options: 'i' } }, { phoneNumber: { $regex: search, $options: 'i' } }]
    }

    // b) lọc theo loại tài khoản (nếu có)
    if (type && type !== 'all') filter.accountType = type

    /* => Trả về filter=<JSON đã encodeURI> */
    return new URLSearchParams({
      filter: JSON.stringify(filter)
    }).toString()
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
    <div className='w-full'>
      {data && (
        <Card className='shadow-md border bg-white rounded-xl'>
          <CardHeader>
            <CardTitle className='text-[#d62828] text-xl'>Danh sách người dùng</CardTitle>
            {/* Red Warning Banner */}
            <div className='bg-[#d62828] text-white p-2 rounded mt-2 flex items-center'>
              <span className='flex items-center'>
                <span className='text-lg mr-2'>❤️</span>
                đây là một bảng điều khiển dùng để quản lý người dùng trong hệ thống hiến máu.
              </span>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 items-center'>
              <Input
                placeholder='Tìm kiếm theo tên hoặc SĐT...'
                onChange={handleSearchChange}
                defaultValue={search}
                className='w-full sm:w-1/3 border rounded p-2'
              />

              <Button variant='outline' onClick={handleResetFilters} className='border rounded p-2'>
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

            <div className='flex flex-col sm:flex-row justify-between items-center pt-4 gap-4'>
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
                    setCurrentPage(newPage) // <- thêm dòng này
                    updateUrlParams(search, accountType, newPage, limit)
                  }}
                >
                  Trước
                </Button>

                {/* Pagination numbers */}
                {getPageList(totalPages, current).map((p, i) =>
                  p === '...' ? (
                    <span key={i + 1} className='px-2'>
                      …
                    </span>
                  ) : (
                    <Button
                      key={p as number}
                      size='sm'
                      variant={p === current ? 'default' : 'outline'}
                      onClick={() => {
                        const newPage = p as number
                        setCurrentPage(newPage)
                        updateUrlParams(search, accountType, newPage, limit)
                      }}
                      className='w-8 h-8 p-0'
                    >
                      {p}
                    </Button>
                  )
                )}

                <Button
                  variant='outline'
                  disabled={current >= totalPages}
                  onClick={() => {
                    const newPage = current + 1
                    setCurrentPage(newPage) // <- thêm dòng này
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
