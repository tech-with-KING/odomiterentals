"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Trash2, Edit3, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart"

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
    <div className="min-h-screen bg-paper">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" className="p-0 h-auto font-normal" asChild>
            <Link href="/shop">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ink mb-2">Shopping Cart</h2>
          <p className="text-muted-foreground">
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
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-muted bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image || "/placeholder.svg"})` }}
                        role="img"
                        aria-label={item.name}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-sans text-lg font-semibold text-ink">
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
                          className="text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Controls */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Quantity */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quantity</label>
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
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</label>
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
                              <span className="text-xs text-muted-foreground">days</span>
                              <Button size="sm" onClick={() => saveEdit(item.id, "duration")} className="h-6 w-6 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                              onClick={() => startEditing(item.id, "duration", item.duration)}
                            >
                              <span className="font-medium">{item.duration}</span>
                              <span className="text-muted-foreground text-sm">days</span>
                              <Edit3 className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Unit Price */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Price/Day
                          </label>
                          <div className="flex items-center space-x-1">
                            <span className="spec font-medium">${item.unitPrice}</span>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</label>
                          <div className="spec font-bold text-lg text-primary">${item.total}</div>
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
                  <ShoppingCart className="w-16 h-16 text-line mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-ink mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">Add some items to get started</p>
                  <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
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
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-[color:var(--sage)] font-medium">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & Fees</span>
                    <span>${taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-ink">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {cartItems.length === 0 ? (
                    <Button className="w-full h-12 text-base font-semibold bg-primary" disabled>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <Button className="w-full h-12 text-base font-semibold bg-primary" asChild>
                      <Link href="/checkout">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-line">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[color:var(--sage)] rounded-full"></div>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[color:var(--sage)] rounded-full"></div>
                      <span>Free returns within 30 days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[color:var(--sage)] rounded-full"></div>
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

