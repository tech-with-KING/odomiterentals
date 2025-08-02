import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import nodemailer from 'nodemailer'

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

// Create email transporter with better error handling
const createTransporter = () => {
  console.log('Creating email transporter with config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.EMAIL_FROM,
    hasPassword: !!process.env.EMAIL_PASSWORD
  })

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true, // Enable debug output
    logger: true // Log information in console
  })
}

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
    message += `   • Price: $${item.total}\n\n`
  })
  
  message += `💰 *Order Total:*\n`
  message += `Subtotal: $${pricing.subtotal.toFixed(2)}\n`
  message += `Delivery: ${pricing.shipping === 0 ? 'Free' : '$' + pricing.shipping.toFixed(2)}\n`
  message += `Taxes: $${pricing.taxes.toFixed(2)}\n`
  message += `*Total: $${pricing.total.toFixed(2)}*\n\n`
  
  if (customerInfo.specialInstructions) {
    message += `📝 *Special Instructions:*\n${customerInfo.specialInstructions}\n\n`
  }
  
  message += `🕒 Order Date: ${new Date(orderData.orderDate).toLocaleString()}`
  
  return encodeURIComponent(message)
}

// Generate customer email HTML
const generateCustomerEmailHTML = (orderData: OrderData, orderId: string) => {
  const { customerInfo, items, pricing } = orderData
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-item { border-bottom: 1px solid #eee; padding: 15px 0; }
            .total-section { background: #f9f9f9; padding: 15px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
                <p>Order #${orderId}</p>
            </div>
            
            <div class="content">
                <h2>Thank you for your order, ${customerInfo.firstName}!</h2>
                <p>We've received your rental order and will contact you shortly via WhatsApp to confirm the details and arrange payment.</p>
                
                <h3>Order Details:</h3>
                <p><strong>Rental Start Date:</strong> ${customerInfo.rentalStartDate}</p>
                <p><strong>Delivery Address:</strong><br>
                ${customerInfo.address}<br>
                ${customerInfo.city}${customerInfo.state ? ', ' + customerInfo.state : ''}${customerInfo.zipCode ? ' ' + customerInfo.zipCode : ''}</p>
                
                <h3>Items Ordered:</h3>
                ${items.map(item => `
                    <div class="order-item">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity} × ${item.duration} days</p>
                        <p>Price: $${item.total.toFixed(2)}</p>
                    </div>
                `).join('')}
                
                <div class="total-section">
                    <h3>Order Summary:</h3>
                    <p>Subtotal: $${pricing.subtotal.toFixed(2)}</p>
                    <p>Delivery Fee: ${pricing.shipping === 0 ? 'Free' : '$' + pricing.shipping.toFixed(2)}</p>
                    <p>Taxes & Fees: $${pricing.taxes.toFixed(2)}</p>
                    <p><strong>Total: $${pricing.total.toFixed(2)}</strong></p>
                </div>
                
                ${customerInfo.specialInstructions ? `
                    <h3>Special Instructions:</h3>
                    <p>${customerInfo.specialInstructions}</p>
                ` : ''}
            </div>
            
            <div class="footer">
                <p>We'll be in touch soon!</p>
                <p>Thank you for choosing our rental service.</p>
            </div>
        </div>
    </body>
    </html>
  `
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

    // Save order to Firebase
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending',
      paymentStatus: 'pending'
    })

    const orderId = orderRef.id
    console.log('Order saved to Firebase with ID:', orderId)

    // Send email to customer with better error handling
    try {
      console.log('Attempting to send customer email to:', customerInfo.email)
      const transporter = createTransporter()
      
      // Verify transporter configuration
      await transporter.verify()
      console.log('Email transporter verified successfully')
      
      const customerEmailHTML = generateCustomerEmailHTML(orderData, orderId)
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: customerInfo.email,
        subject: `Order Confirmation - #${orderId}`,
        html: customerEmailHTML
      }
      
      console.log('Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      })
      
      const result = await transporter.sendMail(mailOptions)
      console.log('Customer email sent successfully:', result.messageId)
      
    } catch (emailError) {
      console.error('Detailed customer email error:', {
        error: emailError,
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : 'No stack trace'
      })
    }

    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(orderData, orderId)
    const businessWhatsApp = process.env.BUSINESS_WHATSAPP_NUMBER || '+1234567890'
    const whatsappUrl = `https://wa.me/${businessWhatsApp.replace(/\+/g, '')}?text=${whatsappMessage}`

    // Send email notification to business owner with better error handling
    try {
      console.log('Attempting to send business notification email')
      const transporter = createTransporter()
      const businessEmail = process.env.BUSINESS_EMAIL || process.env.EMAIL_FROM
      
      const businessEmailHTML = `
        <h2>New Order Received - #${orderId}</h2>
        <p><strong>Customer:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>Total:</strong> $${pricing.total.toFixed(2)}</p>
        <p><a href="${whatsappUrl}" target="_blank">Click here to contact customer via WhatsApp</a></p>
        <hr>
        ${generateCustomerEmailHTML(orderData, orderId)}
      `
      
      const businessMailOptions = {
        from: process.env.EMAIL_FROM,
        to: businessEmail,
        subject: `New Order #${orderId} - ${customerInfo.firstName} ${customerInfo.lastName}`,
        html: businessEmailHTML
      }
      
      console.log('Sending business email to:', businessEmail)
      const businessResult = await transporter.sendMail(businessMailOptions)
      console.log('Business email sent successfully:', businessResult.messageId)
      
    } catch (emailError) {
      console.error('Detailed business email error:', {
        error: emailError,
        message: emailError instanceof Error ? emailError.message : 'Unknown error'
      })
    }

    return NextResponse.json({
      success: true,
      orderId,
      whatsappUrl,
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
