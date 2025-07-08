'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FileText, Eye, Calendar, Edit, Trash2, Archive, CheckCircle, Clock, Image as ImageIcon, X } from 'lucide-react'
import { Blog, BlogStatus } from '@/types/blog'

interface BlogDetailProps {
  blog: Blog
  isOpen: boolean
  onClose: () => void
}

export default function BlogDetail({ blog, isOpen, onClose }: BlogDetailProps) {
  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-300'
      case BlogStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case BlogStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return 'default'
      case BlogStatus.DRAFT:
        return 'secondary'
      case BlogStatus.ARCHIVED:
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case BlogStatus.DRAFT:
        return <Edit className='h-5 w-5 text-yellow-600' />
      case BlogStatus.ARCHIVED:
        return <Archive className='h-5 w-5 text-gray-600' />
      default:
        return <FileText className='h-5 w-5 text-gray-600' />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 500) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='overflow-hidden p-0 flex flex-col h-[90vh]'
        style={{
          maxWidth: '90vw',
          width: '80vw'
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
                <div className='text-left flex-1'>
                  <DialogTitle className='text-xl md:text-2xl font-bold text-white line-clamp-2'>
                    {blog.title}
                  </DialogTitle>
                  <DialogDescription className='text-red-100 mt-1 text-sm md:text-base'>
                    Chi tiết bài viết blog • ID: {blog._id}
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='text-white hover:bg-white/20 p-2 flex-shrink-0'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 md:p-6'>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6'>
            {/* Main Content */}
            <div className='xl:col-span-2 space-y-4 md:space-y-6'>
              {/* Status & Metadata */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    {getStatusIcon(blog.status)}
                    <span>Thông tin trạng thái</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <Badge
                      variant={getStatusBadge(blog.status)}
                      className={`font-semibold text-sm md:text-base px-3 py-1 md:px-4 md:py-2 ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {blog.status}
                    </Badge>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Eye className='h-4 w-4 text-blue-500' />
                      <span>{blog.viewCount} lượt xem</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Calendar className='h-4 w-4 text-green-500' />
                      <div>
                        <span className='text-gray-600'>Tạo lúc:</span>
                        <p className='font-medium'>{formatDate(blog.createdAt)}</p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Clock className='h-4 w-4 text-orange-500' />
                      <div>
                        <span className='text-gray-600'>Cập nhật:</span>
                        <p className='font-medium'>{formatDate(blog.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image */}
              {blog.image && (
                <Card className='shadow-sm'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center space-x-2 text-lg'>
                      <ImageIcon className='h-5 w-5 text-blue-600' />
                      <span>Hình ảnh bài viết</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='rounded-lg overflow-hidden'>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className='w-full h-64 md:h-80 object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Image+Not+Found'
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <FileText className='h-5 w-5 text-purple-600' />
                    <span>Tóm tắt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed'>{blog.summary}</p>
                </CardContent>
              </Card>

              {/* Content Preview */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <FileText className='h-5 w-5 text-indigo-600' />
                    <span>Nội dung bài viết</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='prose max-w-none'>
                    <div className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {truncateContent(blog.content, 1000)}
                    </div>
                    {blog.content.length > 1000 && (
                      <div className='mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500'>
                        <p className='text-sm text-gray-600'>
                          <FileText className='h-4 w-4 inline mr-2' />
                          Nội dung đã được rút gọn. Tổng cộng: {blog.content.length} ký tự
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-4 md:space-y-6'>
              {/* Quick Stats */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>Thống kê</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center p-3 bg-blue-50 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <Eye className='h-4 w-4 text-blue-600' />
                        <span className='text-sm font-medium text-blue-900'>Lượt xem</span>
                      </div>
                      <span className='text-lg font-bold text-blue-900'>{blog.viewCount}</span>
                    </div>

                    <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-green-600' />
                        <span className='text-sm font-medium text-green-900'>Độ dài</span>
                      </div>
                      <span className='text-lg font-bold text-green-900'>{blog.content.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                    <Edit className='h-4 w-4 mr-2' />
                    Chỉnh sửa bài viết
                  </Button>

                  {blog.status === BlogStatus.DRAFT && (
                    <Button className='w-full bg-green-600 hover:bg-green-700'>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      Xuất bản ngay
                    </Button>
                  )}

                  {blog.status === BlogStatus.PUBLISHED && (
                    <Button className='w-full bg-orange-600 hover:bg-orange-700'>
                      <Archive className='h-4 w-4 mr-2' />
                      Lưu trữ bài viết
                    </Button>
                  )}

                  <Button variant='outline' className='w-full hover:bg-gray-50'>
                    <Eye className='h-4 w-4 mr-2' />
                    Xem trên trang web
                  </Button>

                  <Button variant='outline' className='w-full hover:bg-red-50 text-red-600 border-red-200'>
                    <Trash2 className='h-4 w-4 mr-2' />
                    Xóa bài viết
                  </Button>
                </CardContent>
              </Card>

              {/* Status Info */}
              <Card className='shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>Trạng thái</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`p-4 rounded-lg border-l-4 ${
                      blog.status === BlogStatus.PUBLISHED
                        ? 'border-green-500 bg-green-50'
                        : blog.status === BlogStatus.DRAFT
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-500 bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center space-x-2 mb-2'>
                      {getStatusIcon(blog.status)}
                      <h4
                        className={`font-medium ${
                          blog.status === BlogStatus.PUBLISHED
                            ? 'text-green-800'
                            : blog.status === BlogStatus.DRAFT
                            ? 'text-yellow-800'
                            : 'text-gray-800'
                        }`}
                      >
                        {blog.status}
                      </h4>
                    </div>
                    <p className='text-sm text-gray-600'>
                      {blog.status === BlogStatus.PUBLISHED &&
                        'Bài viết này đang hiển thị công khai và có thể được người dùng xem.'}
                      {blog.status === BlogStatus.DRAFT && 'Bài viết này chưa được xuất bản và chỉ admin có thể xem.'}
                      {blog.status === BlogStatus.ARCHIVED && 'Bài viết này đã bị ẩn khỏi danh sách công khai.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='border-t bg-gray-50 p-4 md:p-6 flex-shrink-0'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-sm text-gray-500 text-center sm:text-left'>
              Bài viết #{blog._id} • Tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant='outline' onClick={onClose} className='px-6'>
                Đóng
              </Button>
              <Button className='px-6 bg-blue-600 hover:bg-blue-700'>
                <Edit className='h-4 w-4 mr-2' />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
