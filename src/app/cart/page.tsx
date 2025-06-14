"use client"

import { useState } from "react"
import { Search, Heart, ShoppingCart, Plus, Minus, Trash2, Edit3, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Professional Camera",
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      duration: 5,
      unitPrice: 30,
      total: 150,
      category: "Photography",
    },
    {
      id: 2,
      name: "Lighting Kit",
      image: "/placeholder.svg?height=80&width=80",
      quantity: 2,
      duration: 1,
      unitPrice: 100,
      total: 200,
      category: "Photography",
    },
  ])

  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState("")

  const startEditing = (itemId, field, currentValue) => {
    setEditingField(`${itemId}-${field}`)
    setEditValue(currentValue.toString())
  }

  const saveEdit = (itemId, field) => {
    const newValue = field === "name" ? editValue : Number.parseFloat(editValue) || 0

    setCartItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: newValue }
          if (field !== "name" && field !== "category") {
            updatedItem.total = updatedItem.quantity * updatedItem.duration * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )

    setEditingField(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditValue("")
  }

  const updateQuantity = (itemId, change) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change)
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.duration * item.unitPrice,
          }
        }
        return item
      }),
    )
  }

  const removeItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const taxes = 25
  const shipping = 0
  const total = subtotal + taxes + shipping

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}

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
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
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
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-slate-100"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          {editingField === `${item.id}-name` ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="font-semibold text-lg"
                                autoFocus
                              />
                              <Button size="sm" onClick={() => saveEdit(item.id, "name")} className="h-8 w-8 p-0">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <h3
                                className="font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => startEditing(item.id, "name", item.name)}
                              >
                                {item.name}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(item.id, "name", item.name)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
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
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium text-center min-w-[2rem]">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
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
                          {editingField === `${item.id}-unitPrice` ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">$</span>
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 w-20 text-sm"
                                min="0"
                                step="0.01"
                                autoFocus
                              />
                              <Button size="sm" onClick={() => saveEdit(item.id, "unitPrice")} className="h-6 w-6 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => startEditing(item.id, "unitPrice", item.unitPrice)}
                            >
                              <span className="font-medium">${item.unitPrice}</span>
                              <Edit3 className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
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
