"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth"
import { useCart } from "@/context/cart"
import { useFeedback } from "@/context/feedback"
import { ArrowLeft, ShoppingCart, User, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { COMMITMENT_FEE, DELIVERY_NOTE, buildPricing, formatPrice } from "@/lib/pricing"

interface CustomerInfo {
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

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { toast } = useFeedback()
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    rentalStartDate: "",
    specialInstructions: ""
  })

  // Update email when user loads
  useEffect(() => {
    if (user?.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email as string
      }))
    }
  }, [user])

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Delivery and the commitment fee are agreed on the confirmation call, so the
  // checkout total is exactly what the items come to.
  const subtotal = cartTotal
  const pricing = buildPricing(subtotal)

  const validateForm = (): boolean => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'rentalStartDate']
    return required.every(field => customerInfo[field as keyof CustomerInfo].trim() !== '')
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast({
        title: 'Some details are missing',
        description: 'Fill in every field marked with an asterisk, then submit again.',
        tone: 'warning',
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add something from the catalogue before checking out.',
        tone: 'warning',
      })
      return
    }

    setLoading(true)

    try {
      const orderData = {
        customerInfo,
        items: cartItems,
        pricing,
        orderDate: new Date().toISOString(),
        userId: user?.id || 'guest'
      }

      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json().catch(() => null)

        // Hand the outcome to the success page so it can show the reference and
        // only promise an email if one actually went out.
        sessionStorage.setItem(
          'odomite:last-order',
          JSON.stringify({
            orderId: result?.orderId ?? null,
            emailSent: result?.emailSent?.customer === true,
          })
        )

        // Clear cart (context + localStorage, so the navbar badge and every
        // other page relying on useCart() stay in sync)
        clearCart()

        // Redirect to success page
        router.push('/order-success')
      } else {
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      toast({
        title: 'We could not submit your order',
        description: 'Please try again. If it keeps happening, call us on (862) 230-6639.',
        tone: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Button>
            <h1 className="text-2xl font-bold text-ink">Checkout</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Information Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      First Name *
                    </label>
                    <Input
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Street Address *
                  </label>
                  <Input
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      City *
                    </label>
                    <Input
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      State
                    </label>
                    <Input
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      ZIP Code
                    </label>
                    <Input
                      value={customerInfo.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Rental Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Rental Start Date *
                  </label>
                  <Input
                    type="date"
                    value={customerInfo.rentalStartDate}
                    onChange={(e) => handleInputChange('rentalStartDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={customerInfo.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Any special instructions or requirements..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-paper rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-sm font-medium text-ink truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {item.duration} days
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rental items</span>
                    <span className="text-ink">{formatPrice(pricing.subtotal)}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-right text-sm">{DELIVERY_NOTE}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-ink">
                    <span>Total</span>
                    <span>{formatPrice(pricing.total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No tax is added. Delivery is quoted separately.
                  </p>
                </div>

                {/* Commitment fee — the one thing they must know before submitting. */}
                <div className="rounded-lg border border-[color:var(--brand)]/30 bg-secondary p-4">
                  <p className="text-sm font-semibold text-ink">
                    A ${COMMITMENT_FEE} commitment fee secures your booking
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    It is not charged now. We&apos;ll contact you to confirm availability, agree the
                    delivery charge, and arrange the fee.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitOrder}
                  disabled={loading || cartItems.length === 0}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    "Submitting Order..."
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Submit Order
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Nothing is charged online.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
