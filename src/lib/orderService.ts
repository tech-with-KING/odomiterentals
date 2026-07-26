import { supabase } from '@/lib/supabase'

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

// Row shapes as returned by Supabase (snake_case), mapped to/from the Order interface above.
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    customerInfo: {
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      rentalStartDate: row.rental_start_date,
      specialInstructions: row.special_instructions,
    },
    items: (row.order_items || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      duration: item.duration,
      unitPrice: Number(item.unit_price),
      total: Number(item.total),
      category: item.category,
    })),
    pricing: {
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      taxes: Number(row.taxes),
      total: Number(row.total),
    },
    orderDate: row.created_at,
    userId: row.user_id || 'guest',
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  }
}

const ORDER_SELECT = '*, order_items(*)'

export class OrderService {
  private static instance: OrderService

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  // Create a new order (used for authenticated in-app flows; guest checkout
  // goes through /api/orders/submit, which writes with the service role key).
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { customerInfo, items, pricing, userId } = orderData

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId && userId !== 'guest' ? userId : null,
        first_name: customerInfo.firstName,
        last_name: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip_code: customerInfo.zipCode,
        rental_start_date: customerInfo.rentalStartDate,
        special_instructions: customerInfo.specialInstructions,
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        taxes: pricing.taxes,
        total: pricing.total,
      })
      .select('id')
      .single()

    if (orderError) throw orderError

    if (items.length > 0) {
      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          duration: item.duration,
          unit_price: item.unitPrice,
          total: item.total,
          category: item.category,
        }))
      )
      if (itemsError) throw itemsError
    }

    return order.id
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('id', orderId)
      .maybeSingle()

    if (error) throw error
    return data ? rowToOrder(data) : null
  }

  // Get orders by user ID
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(rowToOrder)
  }

  // Get all orders (for admin)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    let query = supabase.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false })

    if (limitCount) {
      query = query.limit(limitCount)
    }

    const { data, error } = await query
    if (error) throw error
    return (data || []).map(rowToOrder)
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Promise<void> {
    const updateData: Record<string, any> = { status, updated_at: new Date().toISOString() }
    if (notes) updateData.notes = notes

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId)
    if (error) throw error
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
    if (error) throw error
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(rowToOrder)
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    totalRevenue: number
  }> {
    const orders = await this.getAllOrders()

    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      totalRevenue: orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.pricing.total, 0),
    }
  }

  // Delete order (admin only)
  async deleteOrder(orderId: string): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) throw error
  }
}
