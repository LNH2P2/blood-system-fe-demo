'use client'

import { useState, useEffect } from 'react'
import { blogApi } from '@/lib/apis/blog.api'
import { Blog, BlogFilters } from '@/types/blog'
import BlogContent from '@/components/blog/BlogContent'
import { mockBlogs } from '../../data/mockBlogs'

export default function BlogPageView() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BlogFilters>({})

  useEffect(() => {
    loadBlogs()
  }, [filters])

  const loadBlogs = async () => {
    try {
      setLoading(true)

      // Using mock data for testing - replace with API call when backend is ready
      // const response = await blogApi.getBlogs(filters)
      // setBlogs(response.payload.blogs)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter mock data based on filters
      let filteredBlogs = [...mockBlogs]

      if (filters.status) {
        filteredBlogs = filteredBlogs.filter((blog) => blog.status === filters.status)
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredBlogs = filteredBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchTerm) ||
            blog.summary.toLowerCase().includes(searchTerm) ||
            blog.content.toLowerCase().includes(searchTerm)
        )
      }

      // Sort blogs
      if (filters.sortBy) {
        filteredBlogs.sort((a, b) => {
          const aValue = a[filters.sortBy!]
          const bValue = b[filters.sortBy!]

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          } else {
            return aValue > bValue ? 1 : -1
          }
        })
      } else {
        // Default sort by creation date (newest first)
        filteredBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setBlogs(filteredBlogs)
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadBlogs()
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-red-600'></div>
      </div>
    )
  }

  return <BlogContent blogs={blogs} onRefresh={handleRefresh} onFiltersChange={handleFiltersChange} loading={loading} />
}
