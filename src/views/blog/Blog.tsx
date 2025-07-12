'use client'

import { useState, useEffect, useCallback } from 'react'
import { blogApi } from '@/lib/apis/blog.api'
import { Blog, BlogFilters } from '@/types/blog'
import BlogContent from '@/components/blog/BlogContent'

export default function BlogPageView() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [statusCounts, setStatusCounts] = useState<{
    draft: number
    published: number
    archived: number
    private: number
  }>({
    draft: 0,
    published: 0,
    archived: 0,
    private: 0
  })
  const [latestUpdatedAt, setLatestUpdatedAt] = useState<string | null>(null)
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 5
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 5
  })

  // Debounced search effect
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchTerm !== (filters.q || '')) {
        handleFiltersChange({
          q: searchTerm || undefined,
          page: 1
        })
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(delayTimer)
  }, [searchTerm])

  useEffect(() => {
    loadBlogs()
  }, [filters])

  const loadBlogs = async () => {
    try {
      // Show search loading only for search operations
      if (filters.q && !loading) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }

      const response = await blogApi.getBlogs(filters)
      if (response.payload?.data) {
        setBlogs(response.payload.data.data)
        setPagination(response.payload.data.pagination)
        const newStatusCounts = response.payload.data.statusCounts
        setStatusCounts(newStatusCounts)
        setLatestUpdatedAt(response.payload.data.latestUpdatedAt)
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleRefresh = () => {
    setSearchTerm('')
    setFilters({
      page: 1,
      limit: 5
    })
    loadBlogs()
  }

  const handleFiltersChange = useCallback((newFilters: BlogFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except pagination changes)
      page: newFilters.page !== undefined ? newFilters.page : 1
    }))
  }, [])

  // Fast status filter - bypasses debounce
  const handleQuickStatusFilter = (status?: BlogFilters['status']) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1
    }))
  }

  // Fast sort - bypasses debounce
  const handleQuickSort = (order: BlogFilters['order'] = 'desc') => {
    setFilters((prev) => ({
      ...prev,
      order,
      page: 1
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
      statusCounts={statusCounts}
      latestUpdatedAt={latestUpdatedAt}
      setBlogs={setBlogs}
      onRefresh={handleRefresh}
      onFiltersChange={handleFiltersChange}
      onQuickStatusFilter={handleQuickStatusFilter}
      onQuickSort={handleQuickSort}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      searchLoading={searchLoading}
      currentFilters={filters}
      loading={loading}
      pagination={pagination}
    />
  )
}
