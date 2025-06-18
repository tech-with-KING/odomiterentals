export interface User {
  id: string
  email: string
  password: string
  name: string
  type: "customer" | "admin"
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: {
    primary: string
    secondary: string
  }
  specifications: {
    dimensions: {
      width?: string
      depth?: string
      height?: string
      formatted?: string
    }
    material: string
    features: string[]
  }
  pricing: {
    rental: {
      weekly: number
      currency: string
      formatted: string
    }
  }
  images: Array<{
    url: string
    alt: string
    primary: boolean
  }>
  availability: {
    status: "available" | "unavailable" | "maintenance"
    stock_type: string
  }
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  duration: number
  startDate?: string
  endDate?: string
  addedAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface Session {
  token: string
  userId: string
  expiresAt: number
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
