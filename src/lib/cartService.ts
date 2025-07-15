// lib/cartService.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  quantity: number
  duration: number
  unitPrice: number
  total: number
  category: string
  addedAt: Date
}

export interface CartData {
  userId: string
  items: CartItem[]
  updatedAt: Date
  totalItems: number
  totalAmount: number
}

export class CartService {
  private static instance: CartService
  private cartListeners: Map<string, () => void> = new Map()

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService()
    }
    return CartService.instance
  }

  // Get cart reference
  private getCartRef(userId: string) {
    return doc(db, 'carts', userId)
  }

  // Load cart from Firebase
  async loadCart(userId: string): Promise<CartItem[]> {
    try {
      const cartRef = this.getCartRef(userId)
      const cartSnap = await getDoc(cartRef)
      
      if (cartSnap.exists()) {
        const data = cartSnap.data() as CartData
        return data.items || []
      }
      return []
    } catch (error) {
      console.error('Error loading cart:', error)
      throw error
    }
  }

  // Save cart to Firebase
  async saveCart(userId: string, items: CartItem[]): Promise<void> {
    try {
      const cartRef = this.getCartRef(userId)
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

      const cartData: CartData = {
        userId,
        items,
        updatedAt: new Date(),
        totalItems,
        totalAmount
      }

      await setDoc(cartRef, cartData, { merge: true })
    } catch (error) {
      console.error('Error saving cart:', error)
      throw error
    }
  }

  // Add item to cart
  async addToCart(
    userId: string, 
    product: any, 
    quantity: number = 1, 
    duration: number = 1
  ): Promise<void> {
    try {
      const currentItems = await this.loadCart(userId)
      const existingItemIndex = currentItems.findIndex(item => item.productId === product.id)

      if (existingItemIndex > -1) {
        // Update existing item
        currentItems[existingItemIndex].quantity += quantity
        currentItems[existingItemIndex].total = 
          currentItems[existingItemIndex].quantity * 
          currentItems[existingItemIndex].duration * 
          currentItems[existingItemIndex].unitPrice
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.images?.[0] || '',
          quantity,
          duration,
          unitPrice: parseFloat(product.price.toString()),
          total: quantity * duration * parseFloat(product.price.toString()),
          category: product.categories?.[0] || 'General',
          addedAt: new Date()
        }
        currentItems.push(newItem)
      }

      await this.saveCart(userId, currentItems)
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }
 
  // Remove item from cart
  async removeFromCart(userId: string, itemId: string): Promise<void> {
    try {
      const currentItems = await this.loadCart(userId)
      const updatedItems = currentItems.filter(item => item.id !== itemId)
      await this.saveCart(userId, updatedItems)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  // Update item quantity
  async updateQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
    try {
      const currentItems = await this.loadCart(userId)
      const updatedItems = currentItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, quantity)
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.duration * item.unitPrice
          }
        }
        return item
      })
      await this.saveCart(userId, updatedItems)
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  // Update item duration
  async updateDuration(userId: string, itemId: string, duration: number): Promise<void> {
    try {
      const currentItems = await this.loadCart(userId)
      const updatedItems = currentItems.map(item => {
        if (item.id === itemId) {
          const newDuration = Math.max(1, duration)
          return {
            ...item,
            duration: newDuration,
            total: item.quantity * newDuration * item.unitPrice
          }
        }
        return item
      })
      await this.saveCart(userId, updatedItems)
    } catch (error) {
      console.error('Error updating duration:', error)
      throw error
    }
  }

  // Clear cart
  async clearCart(userId: string): Promise<void> {
    try {
      await this.saveCart(userId, [])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  // Listen to cart changes in real-time
  subscribeToCart(userId: string, callback: (items: CartItem[]) => void): () => void {
    const cartRef = this.getCartRef(userId)
    
    const unsubscribe = onSnapshot(cartRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as CartData
        callback(data.items || [])
      } else {
        callback([])
      }
    }, (error) => {
      console.error('Error listening to cart changes:', error)
      callback([])
    })

    // Store the unsubscribe function
    this.cartListeners.set(userId, unsubscribe)
    
    return unsubscribe
  }

  // Cleanup cart listener
  unsubscribeFromCart(userId: string): void {
    const unsubscribe = this.cartListeners.get(userId)
    if (unsubscribe) {
      unsubscribe()
      this.cartListeners.delete(userId)
    }
  }

  // Merge guest cart with user cart (for when user logs in)
  async mergeGuestCart(userId: string, guestCartItems: CartItem[]): Promise<void> {
    try {
      if (guestCartItems.length === 0) return

      const userCartItems = await this.loadCart(userId)
      const mergedItems = [...userCartItems]

      // Merge guest items
      for (const guestItem of guestCartItems) {
        const existingIndex = mergedItems.findIndex(item => item.productId === guestItem.productId)
        
        if (existingIndex > -1) {
          // Combine quantities
          mergedItems[existingIndex].quantity += guestItem.quantity
          mergedItems[existingIndex].total = 
            mergedItems[existingIndex].quantity * 
            mergedItems[existingIndex].duration * 
            mergedItems[existingIndex].unitPrice
        } else {
          // Add new item
          mergedItems.push({
            ...guestItem,
            id: `${guestItem.productId}-${Date.now()}`
          })
        }
      }

      await this.saveCart(userId, mergedItems)
    } catch (error) {
      console.error('Error merging guest cart:', error)
      throw error
    }
  }

  // Get cart statistics
  async getCartStats(userId: string): Promise<{
    totalItems: number
    totalAmount: number
    uniqueProducts: number
  }> {
    try {
      const items = await this.loadCart(userId)
      return {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: items.reduce((sum, item) => sum + item.total, 0),
        uniqueProducts: items.length
      }
    } catch (error) {
      console.error('Error getting cart stats:', error)
      return { totalItems: 0, totalAmount: 0, uniqueProducts: 0 }
    }
  }
}