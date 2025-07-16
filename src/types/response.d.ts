export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    limit: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    totalRecords: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface ApiPaginatedResponse<T> {
  statusCode: number
  message: string
  data: T[]
  pagination: {
    limit: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    totalRecords: number
    totalPages: number
  }
}
