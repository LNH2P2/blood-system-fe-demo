import http from '@/lib/http'
import { Blog, CreateBlogDto, UpdateBlogDto, BlogListResponse, BlogFilters } from '@/types/blog'

const BASE_PATH = '/blog'

export const blogApi = {
  // Get all blogs with filters and pagination - optimized
  getBlogs(filters?: BlogFilters) {
    const queryParams = new URLSearchParams()

    // Only add parameters that have actual values
    if (filters?.status && filters.status.trim()) {
      queryParams.append('status', filters.status)
    }
    if (filters?.q && filters.q.trim()) {
      queryParams.append('q', filters.q.trim())
    }
    if (filters?.order) {
      queryParams.append('order', filters.order)
    }
    if (filters?.page && filters.page > 0) {
      queryParams.append('page', filters.page.toString())
    }
    if (filters?.limit && filters.limit > 0) {
      queryParams.append('limit', filters.limit.toString())
    }

    const queryString = queryParams.toString()
    const url = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH

    return http.get<BlogListResponse>(url)
  },

  // Get blog by ID
  getBlogById(id: string) {
    return http.get<Blog>(`${BASE_PATH}/${id}`)
  },

  // Create new blog
  createBlog(body: CreateBlogDto) {
    return http.post<Blog>(BASE_PATH, body)
  },

  // Update blog
  updateBlog(id: string, body: UpdateBlogDto) {
    return http.patch<Blog>(`${BASE_PATH}/${id}`, body)
  },

  // Delete blog
  deleteBlog(id: string) {
    return http.delete<{ message: string }>(`${BASE_PATH}/${id}`)
  },

  // Publish blog
  publishBlog(id: string) {
    return http.patch<Blog>(`${BASE_PATH}/${id}/publish`, {})
  },

  // Archive blog
  archiveBlog(id: string) {
    return http.patch<Blog>(`${BASE_PATH}/${id}/archive`, {})
  },

  // Increment view count
  incrementViewCount(id: string) {
    return http.patch<Blog>(`${BASE_PATH}/${id}/view`, {})
  }
}
