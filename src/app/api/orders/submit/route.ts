import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { BUSINESS_EMAIL, sendEmail } from '@/lib/email'
import { formatPrice } from '@/lib/pricing'
import {
  buildBusinessEmail,
  buildCustomerEmail,
  buildFollowUpEmail,
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
    const orderData: OrderData = await request.json()

    // Validate required fields
    const { customerInfo, items, pricing } = orderData
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email ||
        !customerInfo.phone || !customerInfo.address || !customerInfo.rentalStartDate ||
        !items.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save order to Supabase
    const { data: savedOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: orderData.userId && orderData.userId !== 'guest' ? orderData.userId : null,
        first_name: customerInfo.firstName,
        last_name: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip_code: customerInfo.zipCode,
        rental_start_date: customerInfo.rentalStartDate,
        special_instructions: customerInfo.specialInstructions,
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

    // The prep email follows the confirmation, so the two land in that order.
    const followUpEmail = await sendEmail({
      to: customerInfo.email,
      subject: `What happens next — booking #${shortId}`,
      html: buildFollowUpEmail(orderData, orderId),
      replyTo: BUSINESS_EMAIL,
    })

    if (!followUpEmail.sent) {
      console.error('Follow-up email failed:', followUpEmail.error)
    }

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
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-notification`, {
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
        followUp: followUpEmail.sent,
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
