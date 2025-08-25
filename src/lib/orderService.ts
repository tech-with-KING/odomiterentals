// Updated OrderService to use API routes instead of direct Firestore access

export interface OrderItem {
  id: string
  productId: string
  name: string
  image: string
  quantity: number
  duration: number
  unitPrice: number
  total: number
  category: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  rentalStartDate: string
  specialInstructions: string
}

export interface Order {
  id?: string
  customerInfo: CustomerInfo
  items: OrderItem[]
  pricing: {
    subtotal: number
    shipping: number
    taxes: number
    total: number
  }
  orderDate: string
  userId: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'delivered' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt?: any
  updatedAt?: any
  notes?: string
}

export class OrderService {
  private static instance: OrderService
  private userEmail: string | null = null

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  // Set admin email for authenticated requests
  setUserEmail(email: string) {
    this.userEmail = email
  }

  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          userEmail: this.userEmail
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      return result.orderId
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // Get order by ID
  async getOrder(orderId: string, userId?: string): Promise<Order | null> {
    try {
      const params = new URLSearchParams()
      if (this.userEmail) params.append('userEmail', this.userEmail)
      if (userId) params.append('userId', userId)

      const response = await fetch(`/api/orders/${orderId}?${params.toString()}`)
      
      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch order')
      }

      const result = await response.json()
      return result.order
    } catch (error) {
      console.error('Error getting order:', error)
      throw error
    }
  }

  // Get orders by user ID
  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams()
      params.append('userId', userId)
      if (this.userEmail) params.append('userEmail', this.userEmail)

      const response = await fetch(`/api/orders?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user orders')
      }

      const result = await response.json()
      return result.orders
    } catch (error) {
      console.error('Error getting user orders:', error)
      throw error
    }
  }

  // Get all orders (for admin)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    try {
      const params = new URLSearchParams()
      if (this.userEmail) params.append('userEmail', this.userEmail)
      if (limitCount) params.append('limit', limitCount.toString())

      const response = await fetch(`/api/orders?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch orders')
      }

      const result = await response.json()
      return result.orders
    } catch (error) {
      console.error('Error getting all orders:', error)
      throw error
    }
  }

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    notes?: string
  ): Promise<void> {
    try {
      const updates: any = { status }
      if (notes) updates.notes = notes

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: this.userEmail,
          updates
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  // Update payment status
  async updatePaymentStatus(
    orderId: string, 
    paymentStatus: Order['paymentStatus']
  ): Promise<void> {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: this.userEmail,
          updates: { paymentStatus }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update payment status')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const params = new URLSearchParams()
      params.append('status', status)
      if (this.userEmail) params.append('userEmail', this.userEmail)

      const response = await fetch(`/api/orders?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch orders by status')
      }

      const result = await response.json()
      return result.orders
    } catch (error) {
      console.error('Error getting orders by status:', error)
      throw error
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    totalRevenue: number
  }> {
    try {
      const params = new URLSearchParams()
      if (this.userEmail) params.append('userEmail', this.userEmail)

      const response = await fetch(`/api/orders/stats?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch order statistics')
      }

      const result = await response.json()
      return result.stats
    } catch (error) {
      console.error('Error getting order stats:', error)
      throw error
    }
  }

  // Delete order (admin only)
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const params = new URLSearchParams()
      if (this.userEmail) params.append('userEmail', this.userEmail)

      const response = await fetch(`/api/orders/${orderId}?${params.toString()}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }
}
