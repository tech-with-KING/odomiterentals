// lib/cartService.ts

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

  // Load cart from API
  async loadCart(userId: string): Promise<CartItem[]> {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to load cart')
      }
      
      const items = await response.json()
      return items || []
    } catch (error) {
      console.error('Error loading cart:', error)
      throw error
    }
  }

  // Save cart to API
  async saveCart(userId: string, items: CartItem[]): Promise<void> {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save cart')
      }
    } catch (error) {
      console.error('Error saving cart:', error)
      throw error
    }
  }

  // Add item to cart via API
  async addToCart(
    userId: string, 
    product: any, 
    quantity: number = 1, 
    duration: number = 1
  ): Promise<void> {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          duration
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }
 
  // Remove item from cart via API
  async removeFromCart(userId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(`/api/cart/update?itemId=${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  // Update item quantity via API
  async updateQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          quantity
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  // Update item duration via API
  async updateDuration(userId: string, itemId: string, duration: number): Promise<void> {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          duration
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update duration')
      }
    } catch (error) {
      console.error('Error updating duration:', error)
      throw error
    }
  }

  // Clear cart via API
  async clearCart(userId: string): Promise<void> {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  // Listen to cart changes - for now, we'll use polling instead of real-time
  // In a production app, you might use WebSockets or Server-Sent Events
  subscribeToCart(userId: string, callback: (items: CartItem[]) => void): () => void {
    const pollInterval = setInterval(async () => {
      try {
        const items = await this.loadCart(userId)
        callback(items)
      } catch (error) {
        console.error('Error polling cart:', error)
        callback([])
      }
    }, 5000) // Poll every 5 seconds

    // Return cleanup function
    const cleanup = () => {
      clearInterval(pollInterval)
      this.cartListeners.delete(userId)
    }

    this.cartListeners.set(userId, cleanup)
    
    // Also load initial data
    this.loadCart(userId).then(callback).catch(() => callback([]))
    
    return cleanup
  }

  // Cleanup cart listener
  unsubscribeFromCart(userId: string): void {
    const cleanup = this.cartListeners.get(userId)
    if (cleanup) {
      cleanup()
    }
  }

  // Merge guest cart with user cart (for when user logs in)
  async mergeGuestCart(userId: string, guestCartItems: CartItem[]): Promise<void> {
    try {
      if (guestCartItems.length === 0) return

      // For simplicity, we'll add each guest item individually
      // In a more sophisticated implementation, you might create a dedicated API endpoint
      for (const guestItem of guestCartItems) {
        await this.addToCart(userId, {
          id: guestItem.productId,
          name: guestItem.name,
          price: guestItem.unitPrice,
          images: [guestItem.image],
          categories: [guestItem.category]
        }, guestItem.quantity, guestItem.duration)
      }
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