"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth"
import { useCart } from "@/context/cart"
import { useFeedback } from "@/context/feedback"
import { ArrowLeft, ShoppingCart, User, MapPin, Calendar, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CUSTOMER_PICKUP_NOTE,
  DELIVERY_NOTE,
  RENTAL_POLICY_PATH,
  SECURITY_DEPOSIT,
  SECURITY_DEPOSIT_LABEL,
  SECURITY_DEPOSIT_NOTE,
  buildPricing,
  formatPrice,
} from "@/lib/pricing"
import {
  DELIVERY_METHODS,
  DELIVERY_METHOD_HINT,
  DELIVERY_METHOD_LABEL,
  type BookingDateMode,
  type CustomerInfo,
  type DeliveryMethod,
  emptyCustomerInfo,
  formatBookingDates,
  formatHomeAddress,
} from "@/lib/booking"

type FieldErrors = Partial<Record<keyof CustomerInfo, string>>

const today = () => new Date().toISOString().split('T')[0]

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { toast } = useFeedback()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() =>
    emptyCustomerInfo(user?.email || "")
  )

  // Update email when user loads
  useEffect(() => {
    if (user?.email) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email as string
      }))
    }
  }, [user])

  const handleInputChange = <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear the message as soon as they start fixing the field it belongs to.
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const isDelivery = customerInfo.deliveryMethod === 'delivery'
  const isRange = customerInfo.bookingDateMode === 'range'

  // Switching to customer pickup drops the event address — there is no delivery
  // to route — and switching back to a single date drops the end date, so a
  // hidden field can never travel with the order.
  const setDeliveryMethod = (deliveryMethod: DeliveryMethod) => {
    setCustomerInfo(prev => ({
      ...prev,
      deliveryMethod,
      eventAddress: deliveryMethod === 'delivery' ? prev.eventAddress : '',
      eventAddressSameAsHome: deliveryMethod === 'delivery' ? prev.eventAddressSameAsHome : true,
    }))
    setErrors(prev => ({ ...prev, eventAddress: undefined }))
  }

  const setBookingDateMode = (bookingDateMode: BookingDateMode) => {
    setCustomerInfo(prev => ({
      ...prev,
      bookingDateMode,
      rentalEndDate: bookingDateMode === 'range' ? prev.rentalEndDate : '',
    }))
    setErrors(prev => ({ ...prev, rentalEndDate: undefined }))
  }

  // Delivery and the security deposit are agreed on the confirmation call, so
  // the checkout total is exactly what the items come to.
  const subtotal = cartTotal
  const pricing = buildPricing(subtotal)

  // What the event address resolves to right now, so the customer can see the
  // copied address rather than trusting a ticked box.
  const mirroredAddress = formatHomeAddress(customerInfo)

  const validateForm = (): FieldErrors => {
    const next: FieldErrors = {}
    const required: Array<[keyof CustomerInfo, string]> = [
      ['firstName', 'Enter your first name.'],
      ['lastName', 'Enter your last name.'],
      ['email', 'Enter your email address.'],
      ['phone', 'Enter a phone number we can reach you on.'],
      ['address', 'Enter your street address.'],
      ['city', 'Enter your city.'],
      ['rentalStartDate', isRange ? 'Pick the first day of the rental.' : 'Pick your event date.'],
    ]

    for (const [field, message] of required) {
      if (!String(customerInfo[field] ?? '').trim()) next[field] = message
    }

    if (customerInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())) {
      next.email = 'That email address does not look right.'
    }

    // A delivery has to have somewhere to go. Pickups do not.
    if (isDelivery && !customerInfo.eventAddressSameAsHome && !customerInfo.eventAddress.trim()) {
      next.eventAddress = 'Enter the event address, or tick the box to use your home address.'
    }

    if (isRange) {
      if (!customerInfo.rentalEndDate.trim()) {
        next.rentalEndDate = 'Pick the last day of the rental.'
      } else if (
        customerInfo.rentalStartDate &&
        customerInfo.rentalEndDate < customerInfo.rentalStartDate
      ) {
        next.rentalEndDate = 'The end date cannot be before the start date.'
      }
    }

    return next
  }

  const handleSubmitOrder = async () => {
    const fieldErrors = validateForm()
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length > 0) {
      toast({
        title: 'Some details are missing',
        description: 'Check the highlighted fields, then submit again.',
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
      // The event address is stored resolved, so nothing downstream has to
      // re-apply the "same as home" rule to know where we are going.
      const payload: CustomerInfo = {
        ...customerInfo,
        eventAddress:
          isDelivery && !customerInfo.eventAddressSameAsHome
            ? customerInfo.eventAddress.trim()
            : mirroredAddress,
      }

      const orderData = {
        customerInfo: payload,
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

        // Hand the outcome to the success page so it can show the reference,
        // repeat back what was booked, and only promise an email if one
        // actually went out.
        sessionStorage.setItem(
          'odomite:last-order',
          JSON.stringify({
            orderId: result?.orderId ?? null,
            emailSent: result?.emailSent?.customer === true,
            customerInfo: payload,
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
                  <Field label="First Name" required error={errors.firstName}>
                    <Input
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      aria-invalid={Boolean(errors.firstName)}
                    />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName}>
                    <Input
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      aria-invalid={Boolean(errors.lastName)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email Address" required error={errors.email}>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      aria-invalid={Boolean(errors.email)}
                    />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </Field>
                </div>

                <Field
                  label="Alternate Phone Number"
                  hint="Optional. We use this only if we cannot reach you during delivery or pickup."
                >
                  <Input
                    type="tel"
                    value={customerInfo.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    placeholder="Second number (optional)"
                  />
                </Field>
              </CardContent>
            </Card>

            {/* How the rental is handed over — this decides what else we ask for. */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>How would you like to receive your rental? *</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  role="radiogroup"
                  aria-label="How would you like to receive your rental?"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {DELIVERY_METHODS.map((method) => {
                    const selected = customerInfo.deliveryMethod === method
                    return (
                      <button
                        key={method}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setDeliveryMethod(method)}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          selected
                            ? 'border-[color:var(--brand)] bg-secondary'
                            : 'border-line hover:border-[color:var(--brand)]/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                              selected ? 'border-[color:var(--brand)]' : 'border-line'
                            }`}
                            aria-hidden="true"
                          >
                            {selected ? (
                              <span className="h-2 w-2 rounded-full bg-[color:var(--brand)]" />
                            ) : null}
                          </span>
                          <span className="text-sm font-semibold text-ink">
                            {DELIVERY_METHOD_LABEL[method]}
                          </span>
                        </span>
                        <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                          {DELIVERY_METHOD_HINT[method]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Your Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Street Address" required error={errors.address}>
                  <Input
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your street address"
                    aria-invalid={Boolean(errors.address)}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="City" required error={errors.city}>
                    <Input
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      aria-invalid={Boolean(errors.city)}
                    />
                  </Field>
                  <Field label="State">
                    <Input
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </Field>
                  <Field label="ZIP Code">
                    <Input
                      value={customerInfo.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="ZIP"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            {/* Event location — only meaningful when we are the ones driving. */}
            {isDelivery ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Event Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-start gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-line accent-[color:var(--brand)]"
                      checked={customerInfo.eventAddressSameAsHome}
                      onChange={(e) =>
                        handleInputChange('eventAddressSameAsHome', e.target.checked)
                      }
                    />
                    <span>Event address is the same as my home address</span>
                  </label>

                  {customerInfo.eventAddressSameAsHome ? (
                    <div className="rounded-lg border border-line bg-paper px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Delivering to
                      </p>
                      <p className="mt-1 text-sm text-ink">
                        {mirroredAddress || 'Fill in your address above and it will appear here.'}
                      </p>
                    </div>
                  ) : (
                    <Field label="Event Address" required error={errors.eventAddress}>
                      <Input
                        value={customerInfo.eventAddress}
                        onChange={(e) => handleInputChange('eventAddress', e.target.value)}
                        placeholder="Where should we deliver and set up?"
                        aria-invalid={Boolean(errors.eventAddress)}
                      />
                    </Field>
                  )}
                </CardContent>
              </Card>
            ) : null}

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
                  <span className="block text-sm font-medium text-ink mb-2">
                    When do you need it? *
                  </span>
                  <div role="radiogroup" aria-label="When do you need it?" className="flex flex-wrap gap-2">
                    {([
                      ['single', 'Single event date'],
                      ['range', 'Rental timeframe'],
                    ] as Array<[BookingDateMode, string]>).map(([mode, label]) => {
                      const selected = customerInfo.bookingDateMode === mode
                      return (
                        <button
                          key={mode}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setBookingDateMode(mode)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            selected
                              ? 'border-[color:var(--brand)] bg-secondary text-ink'
                              : 'border-line text-muted-foreground hover:border-[color:var(--brand)]/50'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className={`grid grid-cols-1 gap-4 ${isRange ? 'md:grid-cols-2' : ''}`}>
                  <Field
                    label={isRange ? 'Start Date' : 'Event Date'}
                    required
                    error={errors.rentalStartDate}
                  >
                    <Input
                      type="date"
                      value={customerInfo.rentalStartDate}
                      onChange={(e) => handleInputChange('rentalStartDate', e.target.value)}
                      min={today()}
                      aria-invalid={Boolean(errors.rentalStartDate)}
                    />
                  </Field>

                  {isRange ? (
                    <Field label="End Date" required error={errors.rentalEndDate}>
                      <Input
                        type="date"
                        value={customerInfo.rentalEndDate}
                        onChange={(e) => handleInputChange('rentalEndDate', e.target.value)}
                        min={customerInfo.rentalStartDate || today()}
                        aria-invalid={Boolean(errors.rentalEndDate)}
                      />
                    </Field>
                  ) : null}
                </div>

                {!isDelivery ? (
                  <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-muted-foreground">
                    Customer pickups begin after 5:00 PM the day before your event, subject to
                    inventory. We will confirm your pickup time when we call.
                  </p>
                ) : null}

                <Field label="Special Instructions">
                  <textarea
                    className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={customerInfo.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder={
                      isDelivery
                        ? 'Access notes, setup times, anything we should know...'
                        : 'Preferred pickup time, vehicle size, anything we should know...'
                    }
                  />
                </Field>
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

                {/* What they chose, echoed back before they commit. */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-muted-foreground">Receiving</span>
                    <span className="text-right text-ink">
                      {DELIVERY_METHOD_LABEL[customerInfo.deliveryMethod]}
                    </span>
                  </div>
                  {customerInfo.rentalStartDate ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">
                        {isRange ? 'Timeframe' : 'Event date'}
                      </span>
                      <span className="text-right text-ink">
                        {formatBookingDates(customerInfo)}
                      </span>
                    </div>
                  ) : null}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rental items</span>
                    <span className="text-ink">{formatPrice(pricing.subtotal)}</span>
                  </div>
                  {/* No delivery line at all when they are collecting it themselves. */}
                  <div className="flex items-baseline justify-between gap-4 text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-right text-sm">
                      {isDelivery ? DELIVERY_NOTE : CUSTOMER_PICKUP_NOTE}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-ink">
                    <span>Total</span>
                    <span>{formatPrice(pricing.total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No tax is added.{' '}
                    {isDelivery
                      ? 'Delivery is quoted separately.'
                      : 'There is no delivery charge on customer pickups.'}
                  </p>
                </div>

                {/* The deposit — the one thing they must know before submitting. */}
                <div className="rounded-lg border border-[color:var(--brand)]/30 bg-secondary p-4">
                  <p className="text-sm font-semibold text-ink">
                    ${SECURITY_DEPOSIT} {SECURITY_DEPOSIT_LABEL}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{SECURITY_DEPOSIT_NOTE}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    It is not charged now. We&apos;ll contact you to confirm availability
                    {isDelivery ? ', agree the delivery charge,' : ','} and arrange the deposit.
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
                  Nothing is charged online. Submitting this order means you accept our{' '}
                  <Link
                    href={RENTAL_POLICY_PATH}
                    className="text-primary underline underline-offset-2"
                  >
                    Rental Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

/** Label, control, and the one line that says what went wrong. */
function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">
        {label} {required ? '*' : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
