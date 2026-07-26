'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  image: string
  quantity: number
  duration: number
  unitPrice: number
  total: number
  category: string
  productId: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, quantity?: number, duration?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateDuration: (itemId: string, duration: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    loadCartFromStorage()
  }, [])

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const addToCart = (product: any, quantity = 1, duration = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id)

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity *
        updatedItems[existingItemIndex].duration *
        updatedItems[existingItemIndex].unitPrice

      setCartItems(updatedItems)
      saveCart(updatedItems)
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        quantity,
        duration,
        unitPrice: parseFloat(product.price.toString()),
        total: quantity * duration * parseFloat(product.price.toString()),
        category: product.categories?.[0] || 'General'
      }

      const updatedItems = [...cartItems, newItem]
      setCartItems(updatedItems)
      saveCart(updatedItems)
    }
  }

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    saveCart(updatedItems)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedItems = cartItems.map(item => {
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
    setCartItems(updatedItems)
    saveCart(updatedItems)
  }

  const updateDuration = (itemId: string, duration: number) => {
    const updatedItems = cartItems.map(item => {
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
    setCartItems(updatedItems)
    saveCart(updatedItems)
  }

  const clearCart = () => {
    setCartItems([])
    saveCart([])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const cartCount = cartItems.length

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateDuration,
    clearCart,
    cartTotal,
    cartCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
