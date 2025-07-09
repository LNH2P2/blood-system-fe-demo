'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  FileText,
  Eye,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2,
  Archive,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import { Blog, BlogStatus, BlogFilters } from '@/types/blog'
import { blogApi } from '@/lib/apis/blog.api'
import BlogForm from './BlogForm'
import BlogDetail from './BlogDetail'

interface BlogContentProps {
  blogs: Blog[]
  setBlogs: (blogs: Blog[]) => void
  onRefresh: () => void
  onFiltersChange: (filters: BlogFilters) => void
  loading: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    totalRecords: number
    limit: number
  }
}

export default function BlogContent({
  blogs,
  setBlogs,
  onRefresh,
  onFiltersChange,
  loading,
  pagination
}: BlogContentProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setBlogToDelete(null)
    setIsDeleting(false)
  }

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return

    try {
      setIsDeleting(true)
      await blogApi.deleteBlog(blogToDelete._id)

      setIsDeleteModalOpen(false)
      setBlogToDelete(null)
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete._id))
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setIsDeleting(false)
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

  const handlePageChange = (page: number) => {
    onFiltersChange({ page })
  }

  const getStatusColor = (status?: BlogStatus) => {
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

  const getStatusBadge = (status?: BlogStatus) => {
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

    return { published, draft, archived }
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
                <p className='text-sm font-medium text-blue-600'>Tổng bài viết</p>
                <p className='text-2xl font-bold text-blue-700'>{pagination?.totalRecords || blogs.length}</p>
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
              <div className='text-2xl font-bold'>{pagination?.totalRecords || blogs.length}</div>
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
                        {blog.status || 'draft'}
                      </Badge>
                    </div>
                    <div className='grid grid-cols-2 gap-6 text-sm mb-3'>
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
                    {(!blog.status || blog.status === BlogStatus.DRAFT) && (
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
                      onClick={() => handleDeleteClick(blog)}
                    >
                      <Trash2 className='h-4 w-4' />
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='p-4 border-t bg-gray-50/50'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-600'>
                Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} của{' '}
                {pagination.totalRecords} bài viết
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className='border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50'
                >
                  <ChevronLeft className='h-4 w-4 mr-1' />
                  Trước
                </Button>

                <div className='flex items-center space-x-1'>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = pagination.currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.currentPage ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          pageNum === pagination.currentPage
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className='border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50'
                >
                  Sau
                  <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center space-x-3'>
              <div className='bg-red-100 p-2 rounded-full'>
                <AlertTriangle className='h-6 w-6 text-red-600' />
              </div>
              <div>
                <DialogTitle className='text-xl font-semibold text-gray-900'>Xác nhận xóa bài viết</DialogTitle>
                <DialogDescription className='text-gray-600 mt-1'>Hành động này không thể hoàn tác</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='py-4'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-sm text-gray-700 mb-2'>Bạn có chắc chắn muốn xóa bài viết này không?</p>
              <div className='bg-white border border-red-200 rounded p-3'>
                <p className='font-medium text-gray-900'>{blogToDelete?.title}</p>
                <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{blogToDelete?.summary}</p>
              </div>
              <p className='text-sm text-red-600 mt-3 font-medium'>
                ⚠️ Sau khi xóa, bài viết sẽ bị mất vĩnh viễn và không thể khôi phục.
              </p>
            </div>
          </div>

          <DialogFooter className='flex justify-end space-x-3'>
            <Button variant='outline' onClick={handleDeleteCancel} disabled={isDeleting} className='px-6'>
              Hủy bỏ
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className='px-6 bg-red-600 hover:bg-red-700 focus:ring-red-500'
            >
              {isDeleting ? (
                <div className='flex items-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Đang xóa...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Trash2 className='h-4 w-4' />
                  <span>Xóa bài viết</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
