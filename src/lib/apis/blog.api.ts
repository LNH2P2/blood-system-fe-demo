import http from '@/lib/http'
import { Blog, CreateBlogDto, UpdateBlogDto, BlogListResponse, BlogFilters } from '@/types/blog'

const BASE_PATH = '/blog'

export const blogApi = {
  // Get all blogs with filters and pagination
  getBlogs(filters?: BlogFilters) {
    const queryParams = new URLSearchParams()

    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())

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
