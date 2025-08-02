import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc, 
  query,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

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

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  // Create a new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return orderRef.id
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, 'orders', orderId)
      const orderSnap = await getDoc(orderRef)
      
      if (orderSnap.exists()) {
        return {
          id: orderSnap.id,
          ...orderSnap.data()
        } as Order
      }
      return null
    } catch (error) {
      console.error('Error getting order:', error)
      throw error
    }
  }

  // Get orders by user ID
  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
    } catch (error) {
      console.error('Error getting user orders:', error)
      throw error
    }
  }

  // Get all orders (for admin)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    try {
      let q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      )
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
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
      const orderRef = doc(db, 'orders', orderId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      }
      
      if (notes) {
        updateData.notes = notes
      }
      
      await updateDoc(orderRef, updateData)
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
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]
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
      const orders = await this.getAllOrders()
      
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        completed: orders.filter(o => o.status === 'completed').length,
        totalRevenue: orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.pricing.total, 0)
      }
      
      return stats
    } catch (error) {
      console.error('Error getting order stats:', error)
      throw error
    }
  }

  // Delete order (admin only)
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await deleteDoc(orderRef)
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }
}
