'use client'

import { useState, useEffect } from 'react'
import { blogApi } from '@/lib/apis/blog.api'
import { Blog, BlogFilters } from '@/types/blog'
import BlogContent from '@/components/blog/BlogContent'

export default function BlogPageView() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 5
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 5
  })

  useEffect(() => {
    loadBlogs()
  }, [filters])

  const loadBlogs = async () => {
    try {
      setLoading(true)

      const response = await blogApi.getBlogs(filters)

      if (response.payload?.data) {
        setBlogs(response.payload.data)
        setPagination(response.payload.pagination)
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadBlogs()
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except pagination changes)
      page: newFilters.page !== undefined ? newFilters.page : 1
    }))
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-red-600'></div>
      </div>
    )
  }

  return (
    <BlogContent
      blogs={blogs}
      setBlogs={setBlogs}
      onRefresh={handleRefresh}
      onFiltersChange={handleFiltersChange}
      loading={loading}
      pagination={pagination}
    />
  )
}
