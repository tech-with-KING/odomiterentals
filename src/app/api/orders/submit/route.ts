import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  BRAND,
  BUSINESS_EMAIL,
  calloutBox,
  detailRows,
  emailLayout,
  escapeHtml,
  paragraph,
  sendEmail,
} from '@/lib/email'
import { COMMITMENT_FEE, DELIVERY_NOTE } from '@/lib/pricing'

interface OrderData {
  customerInfo: {
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
  items: Array<{
    id: string
    name: string
    image: string
    quantity: number
    duration: number
    unitPrice: number
    total: number
    category: string
    productId: string
  }>
  pricing: {
    subtotal: number
    shipping: number
    taxes: number
    total: number
  }
  orderDate: string
  userId: string
}

const money = (value: number) => `$${value.toFixed(2)}`

// Generate WhatsApp message
const generateWhatsAppMessage = (orderData: OrderData, orderId: string) => {
  const { customerInfo, items, pricing } = orderData

  let message = `🛍️ *NEW ORDER RECEIVED* - #${orderId}\n\n`
  message += `👤 *Customer Details:*\n`
  message += `Name: ${customerInfo.firstName} ${customerInfo.lastName}\n`
  message += `📧 Email: ${customerInfo.email}\n`
  message += `📱 Phone: ${customerInfo.phone}\n`
  message += `📍 Address: ${customerInfo.address}, ${customerInfo.city}\n`

  if (customerInfo.state) message += `State: ${customerInfo.state}\n`
  if (customerInfo.zipCode) message += `ZIP: ${customerInfo.zipCode}\n`

  message += `📅 Rental Start: ${customerInfo.rentalStartDate}\n\n`

  message += `🛒 *Order Items:*\n`
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `   • Qty: ${item.quantity} × ${item.duration} days\n`
    message += `   • Price: ${money(item.total)}\n\n`
  })

  message += `💰 *Order Total:*\n`
  message += `Rental items: ${money(pricing.subtotal)}\n`
  message += `Delivery: ${DELIVERY_NOTE}\n`
  message += `*Total: ${money(pricing.total)}*\n`
  message += `Commitment fee to collect: ${money(COMMITMENT_FEE)}\n\n`

  if (customerInfo.specialInstructions) {
    message += `📝 *Special Instructions:*\n${customerInfo.specialInstructions}\n\n`
  }

  message += `🕒 Order Date: ${new Date(orderData.orderDate).toLocaleString()}`

  return encodeURIComponent(message)
}

const renderItems = (items: OrderData['items']) =>
  items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${BRAND.hairline};">
          <div style="font-size:15px;font-weight:500;color:${BRAND.ink};">${escapeHtml(item.name)}</div>
          <div style="font-size:13px;color:${BRAND.mutedInk};margin-top:2px;">
            ${item.quantity} × ${item.duration} ${item.duration === 1 ? 'day' : 'days'} @ ${money(item.unitPrice)}/day
          </div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${BRAND.hairline};text-align:right;font-size:15px;font-weight:500;color:${BRAND.ink};white-space:nowrap;">
          ${money(item.total)}
        </td>
      </tr>`
    )
    .join('')

const renderOrderSummary = (orderData: OrderData) => {
  const { items, pricing } = orderData

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      ${renderItems(items)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:${BRAND.mutedInk};">Rental items</td>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${BRAND.ink};">${money(pricing.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:${BRAND.mutedInk};">Delivery</td>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${BRAND.ink};">${DELIVERY_NOTE}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${BRAND.hairline};font-size:16px;font-weight:600;color:${BRAND.ink};">Total</td>
        <td style="padding:12px 0 0;border-top:1px solid ${BRAND.hairline};text-align:right;font-size:18px;font-weight:600;color:${BRAND.gold};">${money(pricing.total)}</td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:13px;color:${BRAND.mutedInk};">No tax is added. Delivery is quoted separately.</p>`
}

const buildCustomerEmail = (orderData: OrderData, orderId: string) => {
  const { customerInfo } = orderData
  const shortId = orderId.slice(0, 8).toUpperCase()

  const address = [
    customerInfo.address,
    [customerInfo.city, customerInfo.state].filter(Boolean).join(', '),
    customerInfo.zipCode,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br>')

  return emailLayout({
    heading: `Thank you, ${escapeHtml(customerInfo.firstName)}.`,
    preheader: `We've received your rental order #${shortId}.`,
    body: `
      ${paragraph(
        "We've received your rental order. We'll contact you to confirm availability, agree the delivery charge, and arrange the commitment fee. Nothing is charged online."
      )}

      ${calloutBox(`
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:${BRAND.goldDeep};margin-bottom:6px;">Order reference</div>
        <div style="font-size:18px;font-weight:600;color:${BRAND.ink};">#${shortId}</div>
      `)}

      ${calloutBox(`
        <div style="font-size:15px;font-weight:600;color:${BRAND.ink};margin-bottom:6px;">A ${money(
          COMMITMENT_FEE
        )} commitment fee secures your booking</div>
        <div style="font-size:14px;line-height:1.6;color:${BRAND.mutedInk};">
          It is not charged now. We'll arrange it with you when we call to confirm.
        </div>
      `)}

      ${detailRows([
        ['Rental start date', escapeHtml(customerInfo.rentalStartDate)],
        ['Delivery address', address],
        ['Phone', escapeHtml(customerInfo.phone)],
      ])}

      <h2 style="margin:28px 0 12px;font-size:16px;font-weight:600;color:${BRAND.ink};">Items reserved</h2>
      ${renderOrderSummary(orderData)}

      ${
        customerInfo.specialInstructions
          ? `<h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">Special instructions</h2>
             ${paragraph(escapeHtml(customerInfo.specialInstructions))}`
          : ''
      }
    `,
  })
}

const buildBusinessEmail = (orderData: OrderData, orderId: string, whatsappUrl: string) => {
  const { customerInfo, pricing } = orderData
  const shortId = orderId.slice(0, 8).toUpperCase()

  return emailLayout({
    heading: `New order — ${money(pricing.total)}`,
    preheader: `${customerInfo.firstName} ${customerInfo.lastName} placed order #${shortId}.`,
    body: `
      ${detailRows([
        ['Order', `#${shortId}`],
        ['Customer', escapeHtml(`${customerInfo.firstName} ${customerInfo.lastName}`)],
        ['Email', escapeHtml(customerInfo.email)],
        ['Phone', escapeHtml(customerInfo.phone)],
        ['Rental start', escapeHtml(customerInfo.rentalStartDate)],
        [
          'Address',
          escapeHtml(
            [customerInfo.address, customerInfo.city, customerInfo.state, customerInfo.zipCode]
              .filter(Boolean)
              .join(', ')
          ),
        ],
      ])}

      <div style="margin:0 0 24px;">
        <a href="${whatsappUrl}" style="display:inline-block;background:${BRAND.gold};color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:999px;">Message customer on WhatsApp</a>
      </div>

      <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;color:${BRAND.ink};">Order contents</h2>
      ${renderOrderSummary(orderData)}

      ${
        customerInfo.specialInstructions
          ? `<h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">Special instructions</h2>
             ${paragraph(escapeHtml(customerInfo.specialInstructions))}`
          : ''
      }
    `,
  })
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

    const [customerEmail, businessEmail] = await Promise.all([
      sendEmail({
        to: customerInfo.email,
        subject: `Order confirmation — #${shortId}`,
        html: buildCustomerEmail(orderData, orderId),
        replyTo: BUSINESS_EMAIL,
      }),
      sendEmail({
        to: BUSINESS_EMAIL,
        subject: `New order #${shortId} — ${customerInfo.firstName} ${customerInfo.lastName} (${money(pricing.total)})`,
        html: buildBusinessEmail(orderData, orderId, whatsappUrl),
        replyTo: customerInfo.email,
      }),
    ])

    if (!customerEmail.sent) {
      console.error('Customer confirmation email failed:', customerEmail.error)
    }
    if (!businessEmail.sent) {
      console.error('Business notification email failed:', businessEmail.error)
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
