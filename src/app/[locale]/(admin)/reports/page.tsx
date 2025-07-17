'use client'

import Loading from '@/components/loading/loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthContext } from '@/contexts/auth-context'
import {
  useBloodDonationHistory,
  useDemandReport,
  useIncidentReport,
  useMatchRate,
  usePerformanceReport,
  useRequestStats
} from '@/hooks/use-api/use-blood-donation'
import { useGetHospitalBloodInventory } from '@/hooks/use-api/use-hopsital'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Link } from '../../../../i18n/navigation'

// const bloodInventoryData = [
//   { name: 'O+', value: 245 },
//   { name: 'A+', value: 198 },
//   { name: 'B+', value: 167 },
//   { name: 'AB+', value: 89 },
//   { name: 'O-', value: 45 },
//   { name: 'A-', value: 67 }
// ]

// const donationHistoryDetailed = [
//   { month: 'Tháng 1', A: 30, B: 25, AB: 20, O: 45, total: 120 },
//   { month: 'Tháng 2', A: 35, B: 28, AB: 22, O: 65, total: 150 },
//   { month: 'Tháng 3', A: 40, B: 33, AB: 25, O: 82, total: 180 },
//   { month: 'Tháng 4', A: 32, B: 30, AB: 18, O: 60, total: 140 },
//   { month: 'Tháng 5', A: 50, B: 40, AB: 25, O: 85, total: 200 },
//   { month: 'Tháng 6', A: 42, B: 35, AB: 23, O: 70, total: 170 }
// ]

// const requestStatsData = [
//   { name: 'Đã xử lý', value: 320 },
//   { name: 'Đang chờ', value: 45 },
//   { name: 'Khẩn cấp', value: 12 }
// ]

// const matchRateData = [
//   { name: 'Tháng 1', value: 75 },
//   { name: 'Tháng 2', value: 78 },
//   { name: 'Tháng 3', value: 82 },
//   { name: 'Tháng 4', value: 79 },
//   { name: 'Tháng 5', value: 85 },
//   { name: 'Tháng 6', value: 88 }
// ]

// const demandReport = [
//   { name: 'A+', value: 34 },
//   { name: 'B+', value: 28 },
//   { name: 'O-', value: 19 }
// ]

// const performanceReport = [
//   { name: 'Hiến máu', value: 760 },
//   { name: 'Yêu cầu máu', value: 612 },
//   { name: 'Tìm kiếm', value: 943 }
// ]

// const incidentReport = [
//   { name: 'Hủy lịch', value: 14 },
//   { name: 'Sai thông tin', value: 5 },
//   { name: 'Trễ giờ', value: 9 }
// ]

const COLORS = ['#FF6666', '#FFCC66', '#66CC99', '#6699CC', '#9966CC', '#CCCC66']

export default function ReportsPage() {
  const { user } = useAuthContext()
  const [search, setSearch] = useState('')

  const currentYear = new Date().getFullYear()
  const { data: requestStatsData, isLoading: requestStatsLoading } = useRequestStats()
  const { data: matchRateData, isLoading: matchRateLoading } = useMatchRate(currentYear)
  const { data: demandReportData, isLoading: demandReportLoading } = useDemandReport()
  const { data: performanceReportData, isLoading: performanceReportLoading } = usePerformanceReport()
  const { data: incidentReportData, isLoading: incidentReportLoading } = useIncidentReport()
  const { data: bloodInventoryData, isLoading: bloodInventoryLoading } = useGetHospitalBloodInventory(
    user?.hospitalId || ''
  )
  const inventory = bloodInventoryData?.payload?.data?.bloodInventory || []
  const { data: historyData, isLoading: historyLoading } = useBloodDonationHistory(currentYear)
  const loading =
    bloodInventoryLoading ||
    historyLoading ||
    requestStatsLoading ||
    matchRateLoading ||
    demandReportLoading ||
    performanceReportLoading ||
    incidentReportLoading
  if (loading) {
    return <Loading />
  }
  const requestStats = requestStatsData?.payload.data || []
  const matchRate = matchRateData?.payload.data || []
  const demandReport = demandReportData?.payload.data || []
  const performanceReport = performanceReportData?.payload.data || []
  const incidentReport = incidentReportData?.payload.data || []

  return (
    <div className='p-6 space-y-8'>
      {user && user.hospitalId ? (
        <>
          <h1 className='text-3xl font-bold'>Báo cáo hệ thống hiến máu</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Tồn kho máu theo nhóm</h2>
                <p className='text-sm text-gray-500 mb-2'>Số lượng đơn vị máu còn lại ở từng nhóm máu trong kho.</p>

                {inventory.length > 0 ? (
                  <>
                    <ul className='text-sm mb-2 text-gray-700'>
                      {inventory.map((item, index) => (
                        <li key={index}>
                          {item.bloodType}: {item.quantity} đơn vị
                        </li>
                      ))}
                    </ul>

                    <ResponsiveContainer width='100%' height={220}>
                      <PieChart>
                        <Pie dataKey='quantity' data={inventory} cx='50%' cy='50%' outerRadius={80} label>
                          {inventory.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <p className='text-sm text-gray-500'>Không có dữ liệu tồn kho.</p>
                )}
              </CardContent>
            </Card>

            <Card className='col-span-1 xl:col-span-2'>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Lịch sử hiến máu theo nhóm máu và tháng</h2>
                <p className='text-sm text-gray-500 mb-2'>
                  Bảng thống kê chi tiết số lượt hiến máu theo từng nhóm máu trong năm {currentYear}.
                </p>
                {historyLoading ? (
                  <Loading />
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full border text-sm'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='border px-3 py-2'>Tháng</th>
                          <th className='border px-3 py-2'>Nhóm A+</th>
                          <th className='border px-3 py-2'>Nhóm A-</th>
                          <th className='border px-3 py-2'>Nhóm B+</th>
                          <th className='border px-3 py-2'>Nhóm B-</th>
                          <th className='border px-3 py-2'>Nhóm AB+</th>
                          <th className='border px-3 py-2'>Nhóm AB-</th>
                          <th className='border px-3 py-2'>Nhóm O+</th>
                          <th className='border px-3 py-2'>Nhóm O-</th>
                          <th className='border px-3 py-2'>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(historyData?.payload?.data || []).map((row, index) => (
                          <tr key={index} className='text-center'>
                            <td className='border px-3 py-1'>{row.month}</td>
                            <td className='border px-3 py-1'>{row['A+'] || 0}</td>
                            <td className='border px-3 py-1'>{row['A-'] || 0}</td>
                            <td className='border px-3 py-1'>{row['B+'] || 0}</td>
                            <td className='border px-3 py-1'>{row['B-'] || 0}</td>
                            <td className='border px-3 py-1'>{row['AB+'] || 0}</td>
                            <td className='border px-3 py-1'>{row['AB-'] || 0}</td>
                            <td className='border px-3 py-1'>{row['O+'] || 0}</td>
                            <td className='border px-3 py-1'>{row['O-'] || 0}</td>
                            <td className='border px-3 py-1 font-semibold'>{row.total || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card>
          <CardContent className='p-4'>
            <h2 className='text-lg font-semibold mb-2'>Tìm kiếm nhóm máu cần thiết</h2>
            <Input placeholder='Nhập nhóm máu hoặc địa điểm...' value={search} onChange={(e) => setSearch(e.target.value)} />
            <p className='text-sm text-gray-500 mt-2'>Tìm kiếm báo cáo liên quan đến nhóm máu hoặc địa bàn cụ thể.</p>
          </CardContent>
        </Card> */}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6'>
            <Card>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Thống kê yêu cầu máu</h2>
                <p className='text-sm text-gray-500 mb-2'>Số lượng yêu cầu đã xử lý, đang chờ và khẩn cấp.</p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={requestStats}>
                    <XAxis type='number' />
                    <YAxis dataKey='name' type='category' />
                    <Tooltip />
                    <Bar dataKey='value' fill='#FF5733' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Tỷ lệ kết nối thành công</h2>
                <p className='text-sm text-gray-500 mb-2'>
                  Thể hiện % lượt kết nối người hiến và người nhận máu thành công theo tháng.
                </p>
                <ResponsiveContainer width='100%' height={220}>
                  <LineChart data={matchRate}>
                    <XAxis dataKey='name' />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type='monotone' dataKey='value' stroke='#28A745' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6'>
            <Card>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Báo cáo nhu cầu máu</h2>
                <p className='text-sm text-gray-500 mb-2'>Những nhóm máu đang có nhu cầu cao nhất hiện nay.</p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={demandReport}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='value' fill='#E67E22' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <h2 className='text-lg font-semibold mb-2'>Hiệu suất hệ thống</h2>
                <p className='text-sm text-gray-500 mb-2'>
                  Tổng hợp số lượt thao tác chính trên hệ thống trong thời gian gần đây.
                </p>
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={performanceReport}>
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='value' fill='#9B59B6' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='p-4'>
            <h2 className='text-lg font-semibold mb-2'>Báo cáo vi phạm và sự cố</h2>
            <p className='text-sm text-gray-500 mb-2'>
              Các trường hợp sai sót, vi phạm hoặc huỷ lịch trong quá trình xử lý yêu cầu.
            </p>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={incidentReport}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#E74C3C' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}
        </>
      ) : (
        <>
          <div className='flex flex-col items-center justify-center min-h-[400px] text-center space-y-4'>
            <h1 className='text-3xl font-bold text-red-600'>Bạn không có quyền truy cập vào báo cáo này</h1>
            <p className='text-gray-600'>Vui lòng cập nhật thông tin bệnh viện trong trang hồ sơ.</p>
            <Link href={`/profile/${user?.sub}`}>
              <Button variant='secondary'>Quay về trang hồ sơ</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
