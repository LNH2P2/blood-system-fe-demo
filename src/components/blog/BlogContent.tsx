'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Eye, Calendar, Filter, Plus, Edit, Trash2, Archive, Search } from 'lucide-react'
import { Blog, BlogStatus, BlogFilters } from '@/types/blog'
import { blogApi } from '@/lib/apis/blog.api'
import BlogForm from './BlogForm'
import BlogDetail from './BlogDetail'

interface BlogContentProps {
  blogs: Blog[]
  onRefresh: () => void
  onFiltersChange: (filters: BlogFilters) => void
  loading: boolean
}

export default function BlogContent({ blogs, onRefresh, onFiltersChange, loading }: BlogContentProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)

  const handleViewDetail = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedBlog(null)
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingBlog(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingBlog(null)
  }

  const handleFormSuccess = () => {
    handleCloseForm()
    onRefresh()
  }

  const handleDelete = async (blog: Blog) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa blog "${blog.title}"?`)) {
      try {
        // TODO: Replace with actual API call when backend is ready
        // await blogApi.deleteBlog(blog._id)
        console.log('Mock: Deleting blog:', blog.title)
        alert('Xóa thành công! (Mock action)')
        onRefresh()
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const handleStatusChange = async (blog: Blog, newStatus: BlogStatus) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await blogApi.updateBlog(blog._id, { status: newStatus })
      console.log('Mock: Updating blog status:', blog.title, 'to', newStatus)
      alert(`Cập nhật trạng thái thành công! (Mock action)\nBlog: ${blog.title}\nTrạng thái mới: ${newStatus}`)
      onRefresh()
    } catch (error) {
      console.error('Error updating blog status:', error)
    }
  }

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

  const getStats = () => {
    const published = blogs.filter((b) => b.status === BlogStatus.PUBLISHED).length
    const draft = blogs.filter((b) => b.status === BlogStatus.DRAFT).length
    const archived = blogs.filter((b) => b.status === BlogStatus.ARCHIVED).length
    const totalViews = blogs.reduce((sum, blog) => sum + blog.viewCount, 0)

    return { published, draft, archived, totalViews }
  }

  const stats = getStats()

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-green-600'>Đã xuất bản</p>
                <p className='text-2xl font-bold text-green-700'>{stats.published}</p>
              </div>
              <FileText className='h-6 w-6 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-yellow-200 bg-yellow-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-yellow-600'>Bản nháp</p>
                <p className='text-2xl font-bold text-yellow-700'>{stats.draft}</p>
              </div>
              <Edit className='h-6 w-6 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-gray-200 bg-gray-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Đã lưu trữ</p>
                <p className='text-2xl font-bold text-gray-700'>{stats.archived}</p>
              </div>
              <Archive className='h-6 w-6 text-gray-500' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-blue-600'>Tổng lượt xem</p>
                <p className='text-2xl font-bold text-blue-700'>{stats.totalViews}</p>
              </div>
              <Eye className='h-6 w-6 text-blue-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className='bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white/20 p-3 rounded-full'>
              <FileText className='h-8 w-8' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Quản Lý Blog</h1>
              <p className='text-red-100 mt-1'>Tạo và quản lý các bài viết blog của hệ thống</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Cập nhật lần cuối</div>
              <div className='text-lg font-semibold'>
                {new Date().toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Tổng bài viết</div>
              <div className='text-2xl font-bold'>{blogs.length}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Đã xuất bản</div>
              <div className='text-2xl font-bold text-green-300'>{stats.published}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <FileText className='h-5 w-5 text-red-600' />
              <div>
                <CardTitle className='text-gray-800'>Danh sách bài viết</CardTitle>
                <CardDescription>Quản lý và chỉnh sửa các bài viết blog</CardDescription>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Select
                onValueChange={(value) => {
                  const filterStatus = value === 'all' ? undefined : (value as BlogStatus)
                  onFiltersChange({ status: filterStatus })
                }}
              >
                <SelectTrigger className='w-48 border-red-200 focus:border-red-500'>
                  <SelectValue placeholder='Lọc theo trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value={BlogStatus.PUBLISHED}>Đã xuất bản</SelectItem>
                  <SelectItem value={BlogStatus.DRAFT}>Bản nháp</SelectItem>
                  <SelectItem value={BlogStatus.ARCHIVED}>Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm' className='border-red-200 text-red-700 hover:bg-red-50'>
                <Filter className='h-4 w-4 mr-2' />
                Lọc
              </Button>
              <Button size='sm' className='bg-red-600 hover:bg-red-700' onClick={handleCreate}>
                <Plus className='h-4 w-4 mr-2' />
                Tạo bài viết mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='space-y-1'>
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                className={`p-6 border-l-4 hover:bg-gray-50/50 hover:shadow-md transition-all duration-200 border-l-blue-500 bg-blue-50/50 ${
                  index !== blogs.length - 1 ? 'border-b border-gray-100' : ''
                } group cursor-pointer`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-4 mb-3'>
                      <div className='flex items-center space-x-2'>
                        <div className='transition-transform group-hover:scale-110'>
                          <FileText className='h-5 w-5 text-blue-600' />
                        </div>
                        <h4 className='font-semibold text-lg text-gray-800 group-hover:text-red-600 transition-colors'>
                          {blog.title}
                        </h4>
                      </div>
                      <Badge
                        variant={getStatusBadge(blog.status)}
                        className={`font-semibold ${getStatusColor(blog.status)}`}
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    <div className='grid grid-cols-4 gap-6 text-sm mb-3'>
                      <div className='flex items-center space-x-2'>
                        <Eye className='h-4 w-4 text-blue-500' />
                        <span className='text-gray-600'>Lượt xem:</span>
                        <span className='font-bold text-gray-800'>{blog.viewCount}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Calendar className='h-4 w-4 text-green-500' />
                        <span>Tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Calendar className='h-4 w-4 text-orange-500' />
                        <span>Cập nhật: {new Date(blog.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <p className='text-gray-600 text-sm line-clamp-2'>{blog.summary}</p>
                  </div>
                  <div className='flex items-center space-x-3 ml-6'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50'
                      onClick={() => handleViewDetail(blog)}
                    >
                      <Eye className='h-4 w-4 mr-2' />
                      Chi tiết
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-blue-300 text-blue-700 hover:bg-blue-50'
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className='h-4 w-4 mr-2' />
                      Chỉnh sửa
                    </Button>
                    {blog.status === BlogStatus.DRAFT && (
                      <Button
                        size='sm'
                        className='bg-green-600 hover:bg-green-700'
                        onClick={() => handleStatusChange(blog, BlogStatus.PUBLISHED)}
                      >
                        <FileText className='h-4 w-4 mr-2' />
                        Xuất bản
                      </Button>
                    )}
                    {blog.status === BlogStatus.PUBLISHED && (
                      <Button
                        size='sm'
                        className='bg-orange-600 hover:bg-orange-700'
                        onClick={() => handleStatusChange(blog, BlogStatus.ARCHIVED)}
                      >
                        <Archive className='h-4 w-4 mr-2' />
                        Lưu trữ
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-red-300 text-red-700 hover:bg-red-50'
                      onClick={() => handleDelete(blog)}
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {blogs.length === 0 && (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Chưa có bài viết nào</h3>
              <p className='text-gray-600 mb-4'>Bắt đầu tạo bài viết đầu tiên của bạn</p>
              <Button onClick={handleCreate} className='bg-red-600 hover:bg-red-700'>
                <Plus className='h-4 w-4 mr-2' />
                Tạo bài viết mới
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Detail Modal */}
      {selectedBlog && <BlogDetail blog={selectedBlog} isOpen={isDetailOpen} onClose={handleCloseDetail} />}

      {/* Blog Form Modal */}
      {isFormOpen && (
        <BlogForm blog={editingBlog} isOpen={isFormOpen} onClose={handleCloseForm} onSuccess={handleFormSuccess} />
      )}

      {/* Footer Information */}
      <Card className='bg-gradient-to-r from-gray-50 to-gray-100 border-0'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span>Đã xuất bản: Hiển thị công khai</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <span>Bản nháp: Chưa xuất bản</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                <span>Lưu trữ: Ẩn khỏi danh sách</span>
              </div>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-500'>Hệ thống quản lý blog - Cập nhật thời gian thực</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
