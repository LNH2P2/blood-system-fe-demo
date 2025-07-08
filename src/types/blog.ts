export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface Blog {
  _id: string
  title: string
  image: string
  summary: string
  content: string
  status: BlogStatus
  viewCount: number
  createdAt: string
  updatedAt: string
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
}

export interface BlogListResponse {
  blogs: Blog[]
  total: number
  page: number
  limit: number
}

export interface BlogFilters {
  status?: BlogStatus
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'title'
  sortOrder?: 'asc' | 'desc'
}
