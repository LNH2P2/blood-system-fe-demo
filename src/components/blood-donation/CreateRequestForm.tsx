'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Zap, Activity, Heart } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    createdBy: '',
    bloodType: '',
    quantity: 1,
    location: '',
    scheduleDate: '',
    note: '',
    priority: 'Bình thường'
  })
  const [submitting, setSubmitting] = useState(false)

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
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <Label htmlFor='createdBy' className='text-gray-700'>
            Họ tên người tạo
          </Label>
          <Input
            id='createdBy'
            name='createdBy'
            value={form.createdBy}
            onChange={handleChange}
            className='mt-1.5'
            placeholder='Nhập họ tên người tạo'
            required
          />
        </div>
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
      </div>

      <div className='grid grid-cols-2 gap-6'>
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
