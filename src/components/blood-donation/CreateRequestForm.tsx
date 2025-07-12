'use client'
// Enum đồng bộ với backend
export enum DonationRequestStatus {
  SCHEDULED = 0,
  COMPLETED = 1,
  CANCELLED = 2
}
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Zap, Activity, Heart, Search, Plus, User, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { useCreateDonationRequest, useGetAllHospitals } from '@/hooks/use-api/use-blood-donation'
import { useSearchUsers } from '@/hooks/use-api/use-user'
import { toast } from 'sonner'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const PRIORITIES = [
  {
    value: 'urgent',
    label: 'Khẩn cấp',
    icon: <AlertTriangle className='h-5 w-5 text-orange-500' />,
    desc: 'Cần máu gấp, ưu tiên xử lý'
  },
  {
    value: 'normal',
    label: 'Bình thường',
    icon: <Activity className='h-5 w-5 text-blue-500' />,
    desc: 'Không quá gấp, xử lý theo thứ tự'
  }
]

interface UserSearchResult {
  id?: string
  _id?: string
  fullName?: string
  name?: string
  phone?: string
  phoneNumber?: string
  email?: string
  [key: string]: any
}

interface Hospital {
  _id: string
  name: string
  [key: string]: any
}

interface HospitalsResponse {
  status: number
  payload: {
    data: Hospital[]
    [key: string]: any
  }
}

export default function CreateRequestForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [form, setForm] = useState({
    recipientId: '',
    recipientInfo: '',
    bloodType: '',
    quantity: 1,
    hospitalId: '',
    location: '',
    scheduleDate: '',
    note: '',
    priority: 'normal',
    status: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const createDonationRequestMutation = useCreateDonationRequest()
  const { data: hospitalsData, isLoading: loadingHospitals } = useGetAllHospitals()
  const searchUsersMutation = useSearchUsers()

  useEffect(() => {
    const data = hospitalsData as HospitalsResponse | undefined
    if (data && Array.isArray(data.payload?.data)) {
      setHospitals(data.payload.data)
    } else {
      setHospitals([])
    }
  }, [hospitalsData])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value) {
      setSearchResults([])
      setShowCreateNew(false)
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const users = await searchUsersMutation.mutateAsync(value)
        setSearchResults(users as UserSearchResult[])
        setShowCreateNew(true)
      } catch (e) {
        setSearchResults([])
        setShowCreateNew(true)
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleSelectRecipient = (recipient: any) => {
    setForm((prev) => ({
      ...prev,
      recipientId: recipient.id || recipient._id,
      recipientInfo: `${recipient.fullName || recipient.name} - ${recipient.phone || recipient.phoneNumber || ''}`
    }))
    setSearchResults([])
    setSearchTerm('')
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriorityChange = (value: string) => {
    setForm((prev) => ({ ...prev, priority: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        userId: form.recipientId || 'demo-user-id',
        hospitalId: form.hospitalId || '6850cfd1effc21cd19654cd4',
        bloodType: form.bloodType,
        quantity: Number(form.quantity),
        location: form.location,
        scheduleDate: form.scheduleDate,
        note: form.note,
        priority: form.priority,
        status: Number(form.status),
        createdBy: form.recipientInfo || 'Người nhận demo'
      }
      await createDonationRequestMutation.mutateAsync(payload)
      toast.success('Tạo yêu cầu hiến máu thành công!')
      if (onSubmit) onSubmit({ ...form, status: Number(form.status) })
      setForm({
        recipientId: '',
        recipientInfo: '',
        bloodType: '',
        quantity: 1,
        hospitalId: '',
        location: '',
        scheduleDate: '',
        note: '',
        priority: 'normal',
        status: ''
      })
    } catch (error) {
      toast.error('Tạo yêu cầu thất bại. Vui lòng thử lại!')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className='space-y-4 p-6 max-w-4xl mx-auto' onSubmit={handleSubmit} style={{ minWidth: 400 }}>
      {/* Người nhận máu */}
      <div>
        <Label className='text-gray-700'>Người nhận máu</Label>
        <div className='relative'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className='pl-10 pr-4 mt-1.5'
              placeholder='Tìm theo tên, số điện thoại hoặc email'
              autoComplete='off'
            />
            {loading && (
              <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400' />
            )}
          </div>

          {/* Search Results Dropdown */}
          {(searchResults.length > 0 || showCreateNew) && searchTerm && (
            <Card className='absolute z-10 w-full mt-1 border shadow-lg bg-white rounded-md overflow-hidden'>
              <div className='max-h-60 overflow-auto'>
                {searchResults.map((result: any) => (
                  <button
                    key={result.id || result._id}
                    type='button'
                    className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3'
                    onClick={() => handleSelectRecipient(result)}
                  >
                    <User className='h-5 w-5 text-gray-400' />
                    <div>
                      <div className='font-medium'>{result.fullName || result.name}</div>
                      <div className='text-sm text-gray-500'>
                        {(result.phone || result.phoneNumber || '') + (result.email ? ` • ${result.email}` : '')}
                      </div>
                    </div>
                  </button>
                ))}
                {!loading && searchResults.length === 0 && (
                  <div className='px-4 py-3 text-gray-500 text-sm'>Không tìm thấy người phù hợp.</div>
                )}
              </div>
              {showCreateNew && !loading && (
                <div className='border-t p-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    className='w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    onClick={() => {
                      /* TODO: Handle create new */
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Tạo người nhận mới
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
        {form.recipientInfo && <div className='mt-2 text-sm text-gray-600'>Đã chọn: {form.recipientInfo}</div>}
      </div>

      {/* 2 cột: Bệnh viện | Số lượng */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='hospitalId' className='text-gray-700'>
            Bệnh viện
          </Label>
          <div className='relative'>
            <Select
              value={form.hospitalId || ''}
              onValueChange={(value) => {
                const hospital = hospitals.find((h) => h._id === value)
                setForm((prev) => ({
                  ...prev,
                  hospitalId: value,
                  location: hospital?.name || ''
                }))
              }}
              disabled={loadingHospitals}
            >
              <SelectTrigger className='mt-1.5 w-full min-w-[180px]'>
                <SelectValue placeholder={loadingHospitals ? 'Đang tải...' : 'Chọn bệnh viện'} />
              </SelectTrigger>
              <SelectContent className='w-full min-w-[180px]'>
                {hospitals.length === 0 && !loadingHospitals && (
                  <div className='px-4 py-2 text-gray-500'>Không có dữ liệu</div>
                )}
                {hospitals.map((h) => (
                  <SelectItem key={h._id} value={h._id} className='truncate max-w-full'>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor='quantity' className='text-gray-700'>
            Số lượng (đơn vị)
          </Label>
          <Input
            id='quantity'
            name='quantity'
            type='number'
            min={1}
            step={1}
            pattern='[0-9]*'
            value={form.quantity}
            onChange={handleChange}
            className='mt-1.5 w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            required
            autoComplete='off'
            placeholder='Nhập số lượng'
          />
        </div>
      </div>

      {/* 2 cột: Nhóm máu | Trạng thái */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='bloodType' className='text-gray-700'>
            Nhóm máu
          </Label>
          <Select value={form.bloodType} onValueChange={(value) => setForm((prev) => ({ ...prev, bloodType: value }))}>
            <SelectTrigger className='mt-1.5 w-full min-w-[120px]'>
              <SelectValue placeholder='Chọn nhóm máu' />
            </SelectTrigger>
            <SelectContent className='w-full min-w-[120px]'>
              {BLOOD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='status' className='text-gray-700'>
            Trạng thái
          </Label>
          <Select value={form.status || ''} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger className='mt-1.5 w-full min-w-[120px]'>
              <SelectValue placeholder='Chọn trạng thái' />
            </SelectTrigger>
            <SelectContent className='w-full min-w-[120px]'>
              <SelectItem value={DonationRequestStatus.SCHEDULED.toString()}>Chờ xử lý</SelectItem>
              <SelectItem value={DonationRequestStatus.COMPLETED.toString()}>Hoàn thành</SelectItem>
              <SelectItem value={DonationRequestStatus.CANCELLED.toString()}>Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ngày dự kiến & Ghi chú */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='scheduleDate' className='text-gray-700'>
            Ngày dự kiến <span className='text-xs text-gray-400'>(dd/mm/yyyy)</span>
          </Label>
          <Input
            id='scheduleDate'
            name='scheduleDate'
            type='date'
            value={form.scheduleDate}
            onChange={handleChange}
            className='mt-1.5 w-full'
            required
          />
        </div>
        <div>
          <Label htmlFor='note' className='text-gray-700'>
            Ghi chú
          </Label>
          <Textarea
            id='note'
            name='note'
            value={form.note}
            onChange={handleChange}
            rows={3}
            className='mt-1.5 w-full resize-none'
            placeholder='Nhập ghi chú (nếu có)'
          />
        </div>
      </div>

      {/* Ưu tiên */}
      <div>
        <Label className='text-gray-700'>Ưu tiên</Label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-2'>
          {PRIORITIES.map((p) => (
            <label
              key={p.value}
              className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all hover:border-red-200 hover:bg-red-50 ${
                form.priority === p.value ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type='radio'
                name='priority'
                value={p.value}
                checked={form.priority === p.value}
                onChange={() => handlePriorityChange(p.value)}
                className='hidden'
              />
              {p.icon}
              <span className='font-semibold text-sm mt-2'>{p.label}</span>
              <span className='text-xs text-gray-500 text-center mt-1'>{p.desc}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='flex justify-end pt-2 border-t'>
        <Button type='submit' className='bg-red-600 hover:bg-red-700 text-white min-w-[120px]' disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </div>
    </form>
  )
}
