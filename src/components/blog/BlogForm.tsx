'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FileText, Save, X, Image } from 'lucide-react'
import { Blog, BlogStatus, CreateBlogDto, UpdateBlogDto } from '@/types/blog'
import { blogApi } from '@/lib/apis/blog.api'

interface BlogFormProps {
  blog?: Blog | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BlogForm({ blog, isOpen, onClose, onSuccess }: BlogFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    summary: '',
    content: '',
    status: BlogStatus.DRAFT
  })

  const isEditing = !!blog

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        image: blog.image,
        summary: blog.summary,
        content: blog.content,
        status: blog.status
      })
    } else {
      setFormData({
        title: '',
        image: '',
        summary: '',
        content: '',
        status: BlogStatus.DRAFT
      })
    }
  }, [blog])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as BlogStatus
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết')
      return false
    }
    if (!formData.summary.trim()) {
      alert('Vui lòng nhập tóm tắt bài viết')
      return false
    }
    if (!formData.content.trim()) {
      alert('Vui lòng nhập nội dung bài viết')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      if (isEditing && blog) {
        const updateData: UpdateBlogDto = {
          title: formData.title,
          image: formData.image,
          summary: formData.summary,
          content: formData.content,
          status: formData.status
        }
        // TODO: Replace with actual API call when backend is ready
        // await blogApi.updateBlog(blog._id, updateData)
        console.log('Mock: Updating blog:', blog.title, updateData)
        alert(`Cập nhật blog thành công! (Mock action)\nTitle: ${formData.title}`)
      } else {
        const createData: CreateBlogDto = {
          title: formData.title,
          image: formData.image || 'https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Blog+Image',
          summary: formData.summary,
          content: formData.content,
          status: formData.status
        }
        // TODO: Replace with actual API call when backend is ready
        // await blogApi.createBlog(createData)
        console.log('Mock: Creating blog:', createData)
        alert(`Tạo blog thành công! (Mock action)\nTitle: ${formData.title}`)
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving blog:', error)
      alert(`Lỗi ${isEditing ? 'cập nhật' : 'tạo'} bài viết. Vui lòng thử lại.`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'Đã xuất bản'
      case BlogStatus.DRAFT:
        return 'Bản nháp'
      case BlogStatus.ARCHIVED:
        return 'Đã lưu trữ'
      default:
        return status
    }
  }

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'text-green-700'
      case BlogStatus.DRAFT:
        return 'text-yellow-700'
      case BlogStatus.ARCHIVED:
        return 'text-gray-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='overflow-hidden p-0 flex flex-col h-[90vh]'
        style={{
          maxWidth: '95vw',
          width: '90vw'
        }}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-4 md:p-6 rounded-t-lg flex-shrink-0'>
          <DialogHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 md:space-x-4'>
                <div className='bg-white/20 p-2 md:p-3 rounded-full'>
                  <FileText className='h-6 w-6 md:h-8 md:w-8' />
                </div>
                <div className='text-left'>
                  <DialogTitle className='text-xl md:text-2xl font-bold text-white'>
                    {isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                  </DialogTitle>
                  <DialogDescription className='text-red-100 mt-1 text-sm md:text-base'>
                    {isEditing
                      ? `Cập nhật thông tin bài viết "${blog?.title}"`
                      : 'Tạo một bài viết blog mới cho hệ thống'}
                  </DialogDescription>
                </div>
              </div>
              <Button variant='ghost' size='sm' onClick={onClose} className='text-white hover:bg-white/20 p-2'>
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Content */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title' className='text-sm font-medium text-gray-700'>
                    Tiêu đề bài viết *
                  </Label>
                  <Input
                    id='title'
                    type='text'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder='Nhập tiêu đề bài viết...'
                    className='border-gray-300 focus:border-red-500 focus:ring-red-500'
                    required
                  />
                </div>

                {/* Image URL */}
                <div className='space-y-2'>
                  <Label htmlFor='image' className='text-sm font-medium text-gray-700'>
                    Hình ảnh (URL)
                  </Label>
                  <div className='flex space-x-2'>
                    <Input
                      id='image'
                      type='url'
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder='https://example.com/image.jpg'
                      className='border-gray-300 focus:border-red-500 focus:ring-red-500'
                    />
                    <Button type='button' variant='outline' size='sm' className='px-3'>
                      <Image className='h-4 w-4' />
                    </Button>
                  </div>
                  {formData.image && (
                    <div className='mt-2'>
                      <img
                        src={formData.image}
                        alt='Preview'
                        className='w-full h-32 object-cover rounded-lg border'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Invalid+Image'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className='space-y-2'>
                  <Label htmlFor='summary' className='text-sm font-medium text-gray-700'>
                    Tóm tắt *
                  </Label>
                  <textarea
                    id='summary'
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder='Nhập tóm tắt ngắn gọn về bài viết...'
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none'
                    required
                  />
                  <p className='text-xs text-gray-500'>
                    Tóm tắt sẽ hiển thị trong danh sách bài viết ({formData.summary.length}/200 ký tự)
                  </p>
                </div>

                {/* Content */}
                <div className='space-y-2'>
                  <Label htmlFor='content' className='text-sm font-medium text-gray-700'>
                    Nội dung bài viết *
                  </Label>
                  <textarea
                    id='content'
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder='Nhập nội dung chi tiết của bài viết...'
                    rows={12}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none'
                    required
                  />
                  <p className='text-xs text-gray-500'>
                    Nội dung chi tiết của bài viết ({formData.content.length} ký tự)
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className='space-y-6'>
                {/* Status */}
                <Card className='shadow-sm'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg flex items-center space-x-2'>
                      <FileText className='h-5 w-5 text-red-600' />
                      <span>Trạng thái</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='status' className='text-sm font-medium text-gray-700'>
                        Trạng thái xuất bản
                      </Label>
                      <Select value={formData.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className='border-gray-300 focus:border-red-500'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BlogStatus.DRAFT}>
                            <span className='text-yellow-700'>📝 Bản nháp</span>
                          </SelectItem>
                          <SelectItem value={BlogStatus.PUBLISHED}>
                            <span className='text-green-700'>✅ Đã xuất bản</span>
                          </SelectItem>
                          <SelectItem value={BlogStatus.ARCHIVED}>
                            <span className='text-gray-700'>📦 Đã lưu trữ</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div
                      className={`p-3 rounded-lg border-l-4 ${
                        formData.status === BlogStatus.PUBLISHED
                          ? 'border-green-500 bg-green-50'
                          : formData.status === BlogStatus.DRAFT
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-500 bg-gray-50'
                      }`}
                    >
                      <h4 className={`font-medium ${getStatusColor(formData.status)}`}>
                        {getStatusLabel(formData.status)}
                      </h4>
                      <p className='text-sm text-gray-600 mt-1'>
                        {formData.status === BlogStatus.PUBLISHED && 'Bài viết sẽ hiển thị công khai cho người dùng'}
                        {formData.status === BlogStatus.DRAFT && 'Bài viết chưa được xuất bản, chỉ admin có thể xem'}
                        {formData.status === BlogStatus.ARCHIVED && 'Bài viết bị ẩn khỏi danh sách công khai'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata */}
                {isEditing && blog && (
                  <Card className='shadow-sm'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-lg'>Thông tin</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Lượt xem:</span>
                        <span className='font-medium'>{blog.viewCount}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Tạo lúc:</span>
                        <span className='font-medium'>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Cập nhật:</span>
                        <span className='font-medium'>{new Date(blog.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='border-t bg-gray-50 p-4 md:p-6 flex-shrink-0'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-sm text-gray-500 text-center sm:text-left'>
              {isEditing ? 'Cập nhật thông tin bài viết' : 'Tạo bài viết mới cho hệ thống blog'}
            </div>
            <div className='flex items-center space-x-3'>
              <Button type='button' variant='outline' onClick={onClose} disabled={loading} className='px-6'>
                Hủy
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                disabled={loading}
                className='px-6 bg-red-600 hover:bg-red-700'
              >
                {loading ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                {isEditing ? 'Cập nhật' : 'Tạo bài viết'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
