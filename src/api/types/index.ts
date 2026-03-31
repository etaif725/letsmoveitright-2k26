export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  author?: {
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt?: string
  tags?: string[]
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  featuredImage?: string
  client?: string
  industry?: string
  results?: string[]
  publishedAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface ApiParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}
