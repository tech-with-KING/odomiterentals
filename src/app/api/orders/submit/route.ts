import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAppBaseUrl } from '@/lib/app-url'
import { BUSINESS_EMAIL, sendEmail } from '@/lib/email'
import { formatPrice } from '@/lib/pricing'
import { customerInfoToOrderRow, normalizeCustomerInfo } from '@/lib/booking'
import {
  buildBusinessEmail,
  buildCustomerEmail,
  generateWhatsAppMessage,
  type OrderData,
} from '@/lib/order-emails'

const money = formatPrice

/**
 * Everyone who should hear about a new booking: the shop inbox plus every
 * admin on file, deduplicated and lowercased so nobody gets two copies.
 */
async function notificationRecipients(): Promise<string[]> {
  const recipients = new Set<string>()
  if (BUSINESS_EMAIL) recipients.add(BUSINESS_EMAIL.toLowerCase())

  const { data, error } = await supabaseAdmin.from('admins').select('email')
  if (error) {
    console.error('Could not load admin recipients, falling back to the shop inbox:', error)
  } else {
    for (const row of data ?? []) {
      if (row.email) recipients.add(String(row.email).toLowerCase())
    }
  }

  return [...recipients]
}

export async function POST(request: NextRequest) {
  try {
    const submitted: OrderData = await request.json()

    // The browser's validation is a courtesy; this is the one that counts.
    // Normalizing first means a booking posted without the newer fields still
    // lands as a valid single-date delivery rather than being rejected.
    const customerInfo = normalizeCustomerInfo(submitted.customerInfo)
    const orderData: OrderData = { ...submitted, customerInfo }
    const { items, pricing } = orderData

    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email ||
        !customerInfo.phone || !customerInfo.address || !customerInfo.city ||
        !customerInfo.rentalStartDate || !items.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (customerInfo.bookingDateMode === 'range' &&
        customerInfo.rentalEndDate < customerInfo.rentalStartDate) {
      return NextResponse.json(
        { error: 'The end date cannot be before the start date' },
        { status: 400 }
      )
    }

    // Save order to Supabase
    const { data: savedOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: orderData.userId && orderData.userId !== 'guest' ? orderData.userId : null,
        ...customerInfoToOrderRow(customerInfo),
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        taxes: pricing.taxes,
        total: pricing.total,
      })
      .select('id')
      .single()

    if (orderError || !savedOrder) {
      console.error('Error saving order to Supabase:', orderError)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    const orderId = savedOrder.id

    if (items.length > 0) {
      const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
        items.map((item) => ({
          order_id: orderId,
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
      if (itemsError) {
        console.error('Error saving order items to Supabase:', itemsError)
      }
    }

    console.log('Order saved to Supabase with ID:', orderId)

    const whatsappMessage = generateWhatsAppMessage(orderData, orderId)
    const businessWhatsApp = process.env.BUSINESS_WHATSAPP_NUMBER || '+18622306639'
    const whatsappUrl = `https://wa.me/${businessWhatsApp.replace(/\+/g, '')}?text=${whatsappMessage}`

    // Emails must never fail the order — send both, then report what happened.
    const shortId = orderId.slice(0, 8).toUpperCase()

    const recipients = await notificationRecipients()

    const [customerEmail, businessEmail] = await Promise.all([
      sendEmail({
        to: customerInfo.email,
        subject: `Booking confirmation — #${shortId}`,
        html: buildCustomerEmail(orderData, orderId),
        replyTo: BUSINESS_EMAIL,
      }),
      sendEmail({
        to: recipients,
        subject: `New booking #${shortId} — ${customerInfo.firstName} ${customerInfo.lastName} (${money(pricing.total)})`,
        html: buildBusinessEmail(orderData, orderId, whatsappUrl),
        replyTo: customerInfo.email,
      }),
    ])

    if (!customerEmail.sent) {
      console.error('Customer confirmation email failed:', customerEmail.error)
    }
    if (!businessEmail.sent) {
      console.error(
        `Business notification email to ${recipients.join(', ')} failed:`,
        businessEmail.error
      )
    }

    // Send push notification to admin devices
    try {
      const notificationResponse = await fetch(`${getAppBaseUrl(request)}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          total: pricing.total,
          itemCount: items.length
        })
      })

      if (!notificationResponse.ok) {
        console.error('Failed to send push notification:', await notificationResponse.text())
      }
    } catch (notificationError) {
      console.error('Error sending push notification:', notificationError)
    }

    return NextResponse.json({
      success: true,
      orderId,
      whatsappUrl,
      emailSent: {
        customer: customerEmail.sent,
        business: businessEmail.sent,
      },
      message: 'Order submitted successfully'
    })

  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}
