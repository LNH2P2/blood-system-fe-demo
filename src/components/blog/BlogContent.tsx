'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
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
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Search,
  X
} from 'lucide-react'
import { Blog, BlogStatus, BlogFilters } from '@/types/blog'
import { blogApi } from '@/lib/apis/blog.api'
import BlogForm from './BlogForm'
import BlogDetail from './BlogDetail'

interface BlogContentProps {
  blogs: Blog[]
  statusCounts: {
    draft: number
    published: number
    archived: number
    private: number
  }
  latestUpdatedAt: string | null
  setBlogs: (blogs: Blog[]) => void
  onRefresh: () => void
  onFiltersChange: (filters: BlogFilters) => void
  onQuickStatusFilter?: (status?: BlogFilters['status']) => void
  onQuickSort?: (order?: BlogFilters['order']) => void
  searchTerm?: string
  setSearchTerm?: (term: string) => void
  searchLoading?: boolean
  currentFilters?: BlogFilters
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
  statusCounts,
  latestUpdatedAt,
  setBlogs,
  onRefresh,
  onFiltersChange,
  onQuickStatusFilter,
  onQuickSort,
  searchTerm = '',
  setSearchTerm,
  searchLoading = false,
  currentFilters,
  pagination
}: Readonly<BlogContentProps>) {
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
      onRefresh()
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (blog: Blog, newStatus: BlogStatus) => {
    try {
      await blogApi.updateBlog(blog._id, { status: newStatus })
      onRefresh()
    } catch (error) {
      console.error('Error updating blog status:', error)
    }
  }

  const handlePageChange = (page: number) => {
    onFiltersChange({ page })
  }

  const handleClearFilters = () => {
    // Reset search term
    setSearchTerm?.('')

    // Reset all filters to default
    onFiltersChange({
      q: undefined,
      status: undefined,
      order: undefined,
      page: 1
    })

    // Optional: trigger refresh to get fresh data
    // onRefresh()
  }

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchTerm || currentFilters?.status || (currentFilters?.order && currentFilters.order !== 'desc')
  )

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

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  }

  const getViewCountColor = (count: number): string => {
    if (count >= 1000) return 'text-green-600 font-semibold'
    if (count >= 100) return 'text-blue-600 font-medium'
    return 'text-gray-600'
  }

  const getStats = () => {
    const published = statusCounts.published
    const draft = statusCounts.draft
    const archived = statusCounts.archived
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.viewCount ?? 0), 0)

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
                <p className='text-2xl font-bold text-blue-700'>{formatViewCount(stats.totalViews)}</p>
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
                {latestUpdatedAt
                  ? new Date(latestUpdatedAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Chưa có cập nhật'}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Tổng bài viết</div>
              <div className='text-2xl font-bold'>{pagination?.totalRecords ?? blogs.length}</div>
            </div>
            <div className='text-right'>
              <div className='text-sm text-red-100'>Đã xuất bản</div>
              <div className='text-2xl font-bold text-green-300'>{statusCounts.published}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fast Filters */}
      <Card className='shadow-lg border-0'>
        <CardHeader className='bg-gray-50/50 pb-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <Filter className='h-5 w-5 text-red-600' />
              <div>
                <CardTitle className='text-gray-800'>Tìm kiếm và lọc nhanh</CardTitle>
                <CardDescription>Tìm kiếm và lọc bài viết một cách nhanh chóng</CardDescription>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              {hasActiveFilters && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClearFilters}
                  className='border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-700 transition-colors'
                  title='Xóa tất cả bộ lọc và tìm kiếm'
                >
                  <X className='h-4 w-4 mr-2' />
                  Xóa bộ lọc
                </Button>
              )}
              <Button size='sm' className='bg-red-600 hover:bg-red-700' onClick={handleCreate}>
                <Plus className='h-4 w-4 mr-2' />
                Tạo bài viết mới
              </Button>
            </div>
          </div>

          {/* Search Row */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4'>
            <div className='lg:col-span-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Tìm kiếm bài viết (tiêu đề, nội dung)...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm?.(e.target.value)}
                  className='pl-10 border-gray-200 focus:border-red-500'
                />
                {searchLoading && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-600'></div>
                  </div>
                )}
              </div>
            </div>

            <div className='lg:col-span-3'>
              <Select
                value={currentFilters?.status ?? 'all'}
                onValueChange={(value) => {
                  const status = value === 'all' ? undefined : (value as BlogStatus)
                  onQuickStatusFilter?.(status)
                }}
              >
                <SelectTrigger className='border-gray-200 focus:border-red-500'>
                  <SelectValue placeholder='Trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                  <SelectItem value={BlogStatus.PUBLISHED}>Đã xuất bản</SelectItem>
                  <SelectItem value={BlogStatus.DRAFT}>Bản nháp</SelectItem>
                  <SelectItem value={BlogStatus.ARCHIVED}>Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='lg:col-span-3'>
              <Select
                value={`${currentFilters?.order ?? 'desc'}`}
                onValueChange={(value) => {
                  const order = value as BlogFilters['order']
                  onQuickSort?.(order)
                }}
              >
                <SelectTrigger className='border-gray-200 focus:border-red-500'>
                  <SelectValue placeholder='Sắp xếp' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='desc'>Mới nhất</SelectItem>
                  <SelectItem value='asc'>Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className='flex flex-wrap gap-2 items-center'>
            {hasActiveFilters && (
              <div className='flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-700'>
                <Filter className='h-3 w-3 mr-1' />
                Bộ lọc đang hoạt động
                <span className='ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold'>
                  {
                    [
                      searchTerm,
                      currentFilters?.status,
                      currentFilters?.order !== 'desc' ? currentFilters?.order : null
                    ].filter(Boolean).length
                  }
                </span>
              </div>
            )}
            <Button
              variant={!currentFilters?.status ? 'default' : 'outline'}
              size='sm'
              onClick={() => onQuickStatusFilter?.()}
              className={!currentFilters?.status ? 'bg-red-600 hover:bg-red-700' : 'border-gray-200 hover:bg-gray-50'}
            >
              Tất cả ({statusCounts.draft + statusCounts.published + statusCounts.archived})
            </Button>
            <Button
              variant={currentFilters?.status === BlogStatus.PUBLISHED ? 'default' : 'outline'}
              size='sm'
              onClick={() => onQuickStatusFilter?.(BlogStatus.PUBLISHED)}
              className={
                currentFilters?.status === BlogStatus.PUBLISHED
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'border-green-200 text-green-700 hover:bg-green-50'
              }
            >
              <FileText className='h-3 w-3 mr-1' />
              Đã xuất bản ({statusCounts.published})
            </Button>
            <Button
              variant={currentFilters?.status === BlogStatus.DRAFT ? 'default' : 'outline'}
              size='sm'
              onClick={() => onQuickStatusFilter?.(BlogStatus.DRAFT)}
              className={
                currentFilters?.status === BlogStatus.DRAFT
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
              }
            >
              <Edit className='h-3 w-3 mr-1' />
              Bản nháp ({statusCounts.draft})
            </Button>
            <Button
              variant={currentFilters?.status === BlogStatus.ARCHIVED ? 'default' : 'outline'}
              size='sm'
              onClick={() => onQuickStatusFilter?.(BlogStatus.ARCHIVED)}
              className={
                currentFilters?.status === BlogStatus.ARCHIVED
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }
            >
              <Archive className='h-3 w-3 mr-1' />
              Đã lưu trữ ({statusCounts.archived})
            </Button>
          </div>
        </CardHeader>

        {/* Blog List */}
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
                        {blog.status ?? 'draft'}
                      </Badge>
                      {(blog.viewCount ?? 0) > 50 && (
                        <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-300'>
                          🔥 Phổ biến
                        </Badge>
                      )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3'>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Calendar className='h-4 w-4 text-green-500' />
                        <span>Tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Calendar className='h-4 w-4 text-orange-500' />
                        <span>Cập nhật: {new Date(blog.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-gray-600'>
                        <Eye className='h-4 w-4 text-blue-500' />
                        <span className={getViewCountColor(blog.viewCount ?? 0)}>
                          Lượt xem: {formatViewCount(blog.viewCount ?? 0)}
                        </span>
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
              <p className='text-gray-600 mb-4'>
                {searchTerm || currentFilters?.status
                  ? 'Không tìm thấy bài viết nào phù hợp với tìm kiếm/bộ lọc hiện tại'
                  : 'Bắt đầu tạo bài viết đầu tiên của bạn'}
              </p>
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
