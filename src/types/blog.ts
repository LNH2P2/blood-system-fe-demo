export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Blog {
  _id: string
  title: string
  image: string
  summary: string
  content: string
  status?: BlogStatus
  viewCount?: number
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface CreateBlogDto {
  title: string
  image: string
  summary: string
  content: string
  status: BlogStatus
}

export interface UpdateBlogDto {
  title?: string
  image?: string
  summary?: string
  content?: string
  status?: BlogStatus
  category?: string
}

export interface BlogListResponse {
  statusCode: number
  message: string
  data: {
    data: Blog[]
    pagination: {
      limit: number
      currentPage: number
      totalRecords: number
      totalPages: number
    }
    statusCounts: {
      draft: number
      published: number
      archived: number
      private: number
    }
    latestUpdatedAt: string
  }
}

export interface BlogFilters {
  status?: BlogStatus
  q?: string // Changed from 'search' to 'q' to match backend
  order?: 'asc' | 'desc' // Changed from 'sortOrder' to 'order' to match backend
  page?: number
  limit?: number
}
