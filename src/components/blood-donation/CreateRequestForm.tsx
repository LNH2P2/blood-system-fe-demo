'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Zap, Activity, Heart, Search, Plus, User, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import http from '@/lib/http'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const PRIORITIES = [
  {
    value: 'Cấp cứu',
    label: 'Cấp cứu',
    icon: <Zap className='h-5 w-5 text-red-600' />,
    desc: 'Rất gấp, nguy hiểm đến tính mạng'
  },
  {
    value: 'Khẩn cấp',
    label: 'Khẩn cấp',
    icon: <AlertTriangle className='h-5 w-5 text-orange-500' />,
    desc: 'Cần máu trong vài giờ'
  },
  {
    value: 'Bình thường',
    label: 'Bình thường',
    icon: <Activity className='h-5 w-5 text-blue-500' />,
    desc: 'Không quá gấp'
  }
]

export default function CreateRequestForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [form, setForm] = useState({
    recipientId: '',
    recipientInfo: '',
    bloodType: '',
    quantity: 1,
    location: '',
    scheduleDate: '',
    note: '',
    priority: 'Bình thường'
  })
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

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
        // Gọi API tìm user
        const res = await fetch(`http://localhost:3000/api/users?current=1&limit=10&qs=${encodeURIComponent(value)}`)
        const data = await res.json()
        console.log('data:', data)
        // Giả sử data.payload.data là mảng kết quả
        const users = data?.data.data.result || []
        setSearchResults(users)
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
    if (onSubmit) onSubmit(form)
    setTimeout(() => setSubmitting(false), 1000)
  }

  return (
    <form className='space-y-6 p-6' onSubmit={handleSubmit}>
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

      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='bloodType' className='text-gray-700'>
            Nhóm máu
          </Label>
          <Select
            value={form.bloodType}
            onValueChange={(value) => handleChange({ target: { name: 'bloodType', value } })}
          >
            <SelectTrigger className='mt-1.5'>
              <SelectValue placeholder='Chọn nhóm máu' />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            value={form.quantity}
            onChange={handleChange}
            className='mt-1.5'
            required
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='location' className='text-gray-700'>
            Địa điểm
          </Label>
          <Input
            id='location'
            name='location'
            value={form.location}
            onChange={handleChange}
            className='mt-1.5'
            placeholder='Nhập địa điểm'
            required
          />
        </div>
        <div>
          <Label htmlFor='scheduleDate' className='text-gray-700'>
            Ngày dự kiến
          </Label>
          <Input
            id='scheduleDate'
            name='scheduleDate'
            type='date'
            value={form.scheduleDate}
            onChange={handleChange}
            className='mt-1.5'
            required
          />
        </div>
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
          className='mt-1.5 resize-none'
          placeholder='Nhập ghi chú (nếu có)'
        />
      </div>

      <div>
        <Label className='text-gray-700'>Ưu tiên</Label>
        <div className='grid grid-cols-3 gap-4 mt-2'>
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
