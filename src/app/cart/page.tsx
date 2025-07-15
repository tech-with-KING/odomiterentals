"use client"

import { useState, useEffect, useContext, createContext } from "react"
import { ShoppingCart, Plus, Minus, Trash2, Edit3, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Firebase imports (you'll need to uncomment these in your actual implementation)
// import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore"
// import { db } from "@/lib/firebase"

interface CartItem {
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

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider = ({ children, userId }: { children: React.ReactNode, userId?: string }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize cart from Firebase or localStorage
  useEffect(() => {
    const initializeCart = async () => {
      if (userId) {
        // Load from Firebase for authenticated users
        try {
          // Uncomment for Firebase implementation
          // const cartRef = doc(db, 'carts', userId)
          // const cartSnap = await getDoc(cartRef)
          // if (cartSnap.exists()) {
          //   setCartItems(cartSnap.data().items || [])
          // }
        } catch (error) {
          console.error('Error loading cart from Firebase:', error)
          // Fallback to localStorage
          loadCartFromStorage()
        }
      } else {
        // Load from localStorage for guest users
        loadCartFromStorage()
      }
      setLoading(false)
    }

    initializeCart()
  }, [userId])

  // Load cart from localStorage
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

  // Save cart to Firebase or localStorage
  const saveCart = async (items: CartItem[]) => {
    if (userId) {
      // Save to Firebase for authenticated users
      try {
        // Uncomment for Firebase implementation
        // const cartRef = doc(db, 'carts', userId)
        // await setDoc(cartRef, { 
        //   items, 
        //   updatedAt: new Date(),
        //   userId 
        // }, { merge: true })
      } catch (error) {
        console.error('Error saving cart to Firebase:', error)
        // Fallback to localStorage
        localStorage.setItem('cart', JSON.stringify(items))
      }
    } else {
      // Save to localStorage for guest users
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }

  // Add item to cart
  const addToCart = (product: any, quantity = 1, duration = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id)
    
    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].quantity * 
        updatedItems[existingItemIndex].duration * 
        updatedItems[existingItemIndex].unitPrice
      
      setCartItems(updatedItems)
      saveCart(updatedItems)
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
        category: product.categories?.[0] || 'General'
      }
      
      const updatedItems = [...cartItems, newItem]
      setCartItems(updatedItems)
      saveCart(updatedItems)
    }
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    saveCart(updatedItems)
  }

  // Update quantity
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

  // Update duration
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

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    saveCart([])
  }

  // Calculate totals
  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

type EditableField = "name" | "duration" | "unitPrice" | "category"

export default function ShoppingCartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateDuration,
    cartTotal,
    cartCount
  } = useCart()

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEditing = (itemId: string, field: EditableField, currentValue: string | number) => {
    setEditingField(`${itemId}-${field}`)
    setEditValue(currentValue.toString())
  }

  const saveEdit = (itemId: string, field: EditableField): void => {
    if (field === "duration") {
      const newDuration = Math.max(1, parseInt(editValue) || 1)
      updateDuration(itemId, newDuration)
    } else if (field === "unitPrice") {
      // For unit price, you might want to restrict editing or handle differently
      // This is just an example - in real apps, prices usually shouldn't be editable
      console.log("Price editing not implemented for security reasons")
    }
    
    setEditingField(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditValue("")
  }

  const handleQuantityChange = (itemId: string, change: number): void => {
    const currentItem = cartItems.find(item => item.id === itemId)
    if (currentItem) {
      updateQuantity(itemId, currentItem.quantity + change)
    }
  }

  const subtotal = cartTotal
  const taxes = Math.round(subtotal * 0.08) // 8% tax
  const shipping = subtotal > 100 ? 0 : 25 // Free shipping over $100
  const total = subtotal + taxes + shipping

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Shopping Cart</h2>
          <p className="text-slate-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-slate-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image || "/placeholder.svg"})` }}
                        role="img"
                        aria-label={item.name}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {item.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Controls */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Quantity */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Quantity</label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium text-center min-w-[2rem]">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Duration</label>
                          {editingField === `${item.id}-duration` ? (
                            <div className="flex items-center space-x-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 w-16 text-sm"
                                min="1"
                                autoFocus
                              />
                              <span className="text-xs text-slate-600">days</span>
                              <Button size="sm" onClick={() => saveEdit(item.id, "duration")} className="h-6 w-6 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => startEditing(item.id, "duration", item.duration)}
                            >
                              <span className="font-medium">{item.duration}</span>
                              <span className="text-slate-600 text-sm">days</span>
                              <Edit3 className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Unit Price */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Price/Day
                          </label>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">${item.unitPrice}</span>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total</label>
                          <div className="font-bold text-lg text-blue-600">${item.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {cartItems.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-600 mb-6">Add some items to get started</p>
                  <Button>Continue Shopping</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Fees</span>
                    <span>${taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-base font-semibold bg-blue-600"
                    disabled={cartItems.length === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-600 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free returns within 30 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

