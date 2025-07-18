'use client'

import RequestsContent from '@/components/blood-donation/RequestsContent'

export default function RequestsPageView() {
  const recentRequests = [
    {
      id: 1,
      hospital: 'Bệnh viện Chợ Rẫy',
      bloodType: 'O-',
      quantity: 5,
      priority: 'Cấp cứu',
      time: '2 phút trước',
      status: 'Đang xử lý',
      location: 'TP.HCM',
      createdBy: 'Nguyễn Văn A'
    },
    {
      id: 2,
      hospital: 'Bệnh viện Bạch Mai',
      bloodType: 'AB+',
      quantity: 3,
      priority: 'Khẩn cấp',
      time: '15 phút trước',
      status: 'Chờ xác nhận',
      location: 'Hà Nội',
      createdBy: 'Trần Thị B'
    },
    {
      id: 3,
      hospital: 'Bệnh viện Đại học Y Dược',
      bloodType: 'A+',
      quantity: 8,
      priority: 'Bình thường',
      time: '1 giờ trước',
      status: 'Hoàn thành',
      location: 'TP.HCM',
      createdBy: 'Lê Văn C'
    },
    {
      id: 4,
      hospital: 'Bệnh viện Việt Đức',
      bloodType: 'B-',
      quantity: 2,
      priority: 'Khẩn cấp',
      time: '2 giờ trước',
      status: 'Đang vận chuyển',
      location: 'Hà Nội',
      createdBy: 'Phạm Thị D'
    },
    {
      id: 5,
      hospital: 'Bệnh viện K',
      bloodType: 'A-',
      quantity: 10,
      priority: 'Cấp cứu',
      time: '3 giờ trước',
      status: 'Đang xử lý',
      location: 'Hà Nội',
      createdBy: 'Ngô Văn E'
    },
    {
      id: 6,
      hospital: 'Bệnh viện 175',
      bloodType: 'B+',
      quantity: 6,
      priority: 'Bình thường',
      time: '4 giờ trước',
      status: 'Hoàn thành',
      location: 'TP.HCM',
      createdBy: 'Đỗ Thị F'
    }
  ]

  return <RequestsContent requests={recentRequests} />
}
