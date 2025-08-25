import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import nodemailer from "nodemailer"

// Initialize Firebase Admin directly in this file to avoid import issues
let adminDb: any

function getAdminDb() {
  if (!adminDb) {
    console.log("Initializing Firebase Admin SDK in order route...")

    if (getApps().length === 0) {
      let credential

      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
        console.log("Using environment variables for Firebase Admin")
        credential = cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        })
      } else {
        console.log("Using service account file for Firebase Admin")
        const serviceKey = require("../../../../../src/service_key.json")
        credential = cert(serviceKey)
      }

      const app = initializeApp({ credential })
      adminDb = getFirestore(app)
      console.log("Firebase Admin SDK initialized successfully in order route")
    } else {
      adminDb = getFirestore()
      console.log("Using existing Firebase Admin app in order route")
    }
  }

  return adminDb
}

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
  console.log("Creating email transporter with config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.EMAIL_FROM,
    hasPassword: !!process.env.EMAIL_PASSWORD,
  })

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true, // Enable debug output
    logger: true, // Log information in console
  })
}

// WhatsApp integration removed. Only email notifications are sent.

// Generate customer email HTML
const generateCustomerEmailHTML = (orderData: OrderData, orderId: string) => {
  const { customerInfo, items, pricing } = orderData

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #374151; 
                margin: 0; 
                padding: 0; 
                background-color: #f9fafb;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0 0 10px 0; 
                font-size: 28px; 
                font-weight: 600; 
            }
            .header p { 
                margin: 0; 
                font-size: 16px; 
                opacity: 0.9; 
            }
            .content { 
                padding: 40px 30px; 
            }
            .content h2 { 
                color: #1f2937; 
                margin: 0 0 20px 0; 
                font-size: 24px; 
                font-weight: 600; 
            }
            .content h3 { 
                color: #374151; 
                margin: 30px 0 15px 0; 
                font-size: 18px; 
                font-weight: 600; 
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            .info-item {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            .info-item strong {
                color: #1f2937;
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .order-item { 
                display: flex;
                align-items: center;
                background: #f8fafc;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                transition: all 0.2s;
            }
            .order-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
            }
            .product-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 10px;
                margin-right: 20px;
                border: 2px solid #e5e7eb;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .item-details {
                flex: 1;
            }
            .item-details h4 { 
                margin: 0 0 8px 0; 
                color: #1f2937; 
                font-size: 18px; 
                font-weight: 600; 
            }
            .item-details p { 
                margin: 4px 0; 
                color: #6b7280; 
                font-size: 14px; 
            }
            .item-price {
                font-size: 20px;
                font-weight: 700;
                color: #059669;
                background: #ecfdf5;
                padding: 8px 16px;
                border-radius: 8px;
                border: 1px solid #a7f3d0;
            }
            .total-section { 
                background: #f8fafc; 
                padding: 25px; 
                margin-top: 30px; 
                border-radius: 12px;
                border: 1px solid #e5e7eb;
            }
            .total-section h3 { 
                margin: 0 0 15px 0; 
                color: #1f2937; 
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
            }
            .total-row.final {
                border-top: 2px solid #2563eb;
                padding-top: 15px;
                margin-top: 15px;
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
            }
            .special-instructions {
                background: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
            }
            .special-instructions h3 {
                color: #92400e;
                margin-top: 0;
            }
            .footer { 
                text-align: center; 
                padding: 30px;
                background: #1f2937;
                color: #9ca3af;
                font-size: 14px;
            }
            .footer p {
                margin: 5px 0;
            }
            @media (max-width: 600px) {
                body { padding: 10px; }
                .container { margin: 0; }
                .content, .header { padding: 30px 20px; }
                .info-grid { grid-template-columns: 1fr; }
                .order-item { flex-direction: column; text-align: center; }
                .product-image { margin: 0 0 15px 0; }
            }
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
                <p>We've received your rental order and will contact you shortly via email to confirm the details and arrange payment.</p>
                
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Rental Start Date</strong>
                        ${customerInfo.rentalStartDate}
                    </div>
                    <div class="info-item">
                        <strong>Delivery Address</strong>
                        ${customerInfo.address}<br>
                        ${customerInfo.city}${customerInfo.state ? ", " + customerInfo.state : ""}${customerInfo.zipCode ? " " + customerInfo.zipCode : ""}
                    </div>
                </div>
                
                <h3>Items Ordered</h3>
                ${items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="product-image" onerror="this.style.display='none'">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p><strong>Category:</strong> ${item.category}</p>
                            <p><strong>Quantity:</strong> ${item.quantity} × ${item.duration} days</p>
                        </div>
                        <div class="item-price">$${item.total.toFixed(2)}</div>
                    </div>
                `,
                  )
                  .join("")}
                
                <div class="total-section">
                    <h3>Order Summary</h3>
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>$${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Delivery Fee:</span>
                        <span>${pricing.shipping === 0 ? "Free" : "$" + pricing.shipping.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Taxes & Fees:</span>
                        <span>$${pricing.taxes.toFixed(2)}</span>
                    </div>
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>$${pricing.total.toFixed(2)}</span>
                    </div>
                </div>
                
                ${
                  customerInfo.specialInstructions
                    ? `
                    <div class="special-instructions">
                        <h3>Special Instructions</h3>
                        <p>${customerInfo.specialInstructions}</p>
                    </div>
                `
                    : ""
                }
            </div>
            
            <div class="footer">
                <p><strong>We'll be in touch soon!</strong></p>
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
    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.rentalStartDate ||
      !items.length
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save order to Firebase using Admin SDK
    let orderId: string
    try {
      console.log("Attempting to save order to Firestore...")

      // Get the initialized adminDb
      const db = getAdminDb()

      if (!db) {
        throw new Error("Firebase Admin DB is not initialized")
      }

      const orderRef = await db.collection("orders").add({
        ...orderData,
        createdAt: new Date(),
        status: "pending",
        paymentStatus: "pending",
      })

      orderId = orderRef.id
      console.log("Order saved to Firebase with ID:", orderId)
    } catch (firebaseError) {
      console.error("Error saving order to Firebase:", firebaseError)
      return NextResponse.json({ error: "Failed to save order to database" }, { status: 500 })
    }

    // Send email to customer with better error handling
    try {
      console.log("Attempting to send customer email to:", customerInfo.email)
      const transporter = createTransporter()

      // Verify transporter configuration
      await transporter.verify()
      console.log("Email transporter verified successfully")

      const customerEmailHTML = generateCustomerEmailHTML(orderData, orderId)

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: customerInfo.email,
        subject: `Order Confirmation - #${orderId}`,
        html: customerEmailHTML,
      }

      console.log("Sending email with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      })

      const result = await transporter.sendMail(mailOptions)
      console.log("Customer email sent successfully:", result.messageId)
    } catch (emailError) {
      console.error("Detailed customer email error:", {
        error: emailError,
        message: emailError instanceof Error ? emailError.message : "Unknown error",
        stack: emailError instanceof Error ? emailError.stack : "No stack trace",
      })
    }

    // WhatsApp integration removed. No WhatsApp message or link generated.

    // Send email notifications to all admin emails
    try {
      console.log("Attempting to send admin notification emails")
      const transporter = createTransporter()

      // Get all admin emails
      const adminEmails = [process.env.ADMIN_EMAIL, process.env.BUSINESS_EMAIL, process.env.EMAIL_FROM].filter(
        (email) => email && email.trim() !== "",
      )

      // Add extra admin emails if configured
      if (process.env.EXTRA_ADMIN_EMAILS) {
        const extraEmails = process.env.EXTRA_ADMIN_EMAILS.split(",")
          .map((email) => email.trim())
          .filter((email) => email !== "")
        adminEmails.push(...extraEmails)
      }

      // Remove duplicates
      const uniqueAdminEmails = [...new Set(adminEmails)]

      console.log("Sending order notifications to admin emails:", uniqueAdminEmails)

      if (uniqueAdminEmails.length === 0) {
        console.warn("No admin emails configured for notifications")
      } else {
        const adminEmailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                      margin: 0; 
                      padding: 20px; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      min-height: 100vh;
                  }
                  .container { 
                      max-width: 700px; 
                      margin: 0 auto; 
                      background: white;
                      border-radius: 16px;
                      overflow: hidden;
                      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  }
                  .header { 
                      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                      color: white; 
                      padding: 30px; 
                      text-align: center; 
                      position: relative;
                  }
                  .header::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                      opacity: 0.3;
                  }
                  .header h1 { 
                      margin: 0 0 10px 0; 
                      font-size: 32px; 
                      font-weight: 700;
                      position: relative;
                      z-index: 1;
                  }
                  .header h2 { 
                      margin: 0; 
                      font-size: 20px; 
                      font-weight: 500;
                      opacity: 0.95;
                      position: relative;
                      z-index: 1;
                  }
                  .content { 
                      padding: 0; 
                      background: #f8fafc; 
                  }
                  .section {
                      background: white;
                      margin: 20px;
                      padding: 25px;
                      border-radius: 12px;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      border-left: 4px solid;
                  }
                  .section.summary { border-left-color: #dc2626; }
                  .section.contact { border-left-color: #2563eb; }
                  .section.items { border-left-color: #7c3aed; }
                  .section.pricing { border-left-color: #059669; }
                  .section h3 { 
                      margin: 0 0 20px 0; 
                      font-size: 20px; 
                      font-weight: 600;
                      display: flex;
                      align-items: center;
                      gap: 10px;
                  }
                  .section.summary h3 { color: #dc2626; }
                  .section.contact h3 { color: #2563eb; }
                  .section.items h3 { color: #7c3aed; }
                  .section.pricing h3 { color: #059669; }
                  .info-grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                      gap: 15px;
                  }
                  .info-item {
                      background: #f8fafc;
                      padding: 15px;
                      border-radius: 8px;
                      border: 1px solid #e5e7eb;
                  }
                  .info-item strong {
                      display: block;
                      color: #374151;
                      margin-bottom: 5px;
                      font-size: 14px;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                  }
                  .info-item span {
                      font-size: 16px;
                      font-weight: 600;
                      color: #1f2937;
                  }
                  .contact-actions {
                      margin-top: 20px;
                      display: flex;
                      gap: 15px;
                      flex-wrap: wrap;
                  }
                  .contact-btn {
                      background: #2563eb;
                      color: white;
                      padding: 12px 24px;
                      border-radius: 8px;
                      text-decoration: none;
                      font-weight: 600;
                      display: inline-flex;
                      align-items: center;
                      gap: 8px;
                      transition: all 0.2s;
                  }
                  .contact-btn:hover {
                      background: #1d4ed8;
                      transform: translateY(-1px);
                  }
                  .product-image {
                      width: 80px;
                      height: 80px;
                      object-fit: cover;
                      border-radius: 10px;
                      margin-right: 20px;
                      border: 2px solid #e5e7eb;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  }
                  .item-details {
                      flex: 1;
                  }
                  .item-details h4 { 
                      margin: 0 0 8px 0; 
                      color: #1f2937; 
                      font-size: 18px; 
                      font-weight: 600; 
                  }
                  .item-details p { 
                      margin: 4px 0; 
                      color: #6b7280; 
                      font-size: 14px; 
                  }
                  .item-price {
                      font-size: 20px;
                      font-weight: 700;
                      color: #059669;
                      background: #ecfdf5;
                      padding: 8px 16px;
                      border-radius: 8px;
                      border: 1px solid #a7f3d0;
                  }
                  .pricing-breakdown {
                      background: #f0fdf4;
                      border: 2px solid #059669;
                      border-radius: 12px;
                      padding: 20px;
                  }
                  .pricing-row {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 10px;
                      padding: 8px 0;
                  }
                  .pricing-row.total {
                      border-top: 2px solid #059669;
                      padding-top: 15px;
                      margin-top: 15px;
                      font-size: 20px;
                      font-weight: 700;
                      color: #059669;
                  }
                  .special-instructions {
                      background: #fef3c7;
                      border: 2px solid #f59e0b;
                      border-radius: 12px;
                      padding: 20px;
                      margin: 20px;
                  }
                  .special-instructions h4 {
                      color: #92400e;
                      margin: 0 0 10px 0;
                      font-size: 18px;
                      font-weight: 600;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                  }
                  .footer {
                      text-align: center;
                      padding: 30px;
                      background: #1f2937;
                      color: #9ca3af;
                      font-size: 14px;
                  }
                  .footer p {
                      margin: 5px 0;
                  }
                  @media (max-width: 600px) {
                      body { padding: 10px; }
                      .section { margin: 10px; padding: 20px; }
                      .info-grid { grid-template-columns: 1fr; }
                      .contact-actions { justify-content: center; }
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🛍️ ORDER RECEIVED! 🎉</h1>
                      <h2>odomiterentals.com #${orderId}</h2>
                  </div>
                  
                  <div class="content">
                      <div class="section summary">
                          <h3>📋 Order Summary</h3>
                          <div class="info-grid">
                              <div class="info-item">
                                  <strong>👤 Customer</strong>
                                  <span>${customerInfo.firstName} ${customerInfo.lastName}</span>
                              </div>
                              <div class="info-item">
                                  <strong>💰 Total Value</strong>
                                  <span>$${pricing.total.toFixed(2)}</span>
                              </div>
                              <div class="info-item">
                                  <strong>📦 Items Count</strong>
                                  <span>${items.length} item(s)</span>
                              </div>
                              <div class="info-item">
                                  <strong>📅 Rental Date</strong>
                                  <span>${customerInfo.rentalStartDate}</span>
                              </div>
                          </div>
                      </div>
                      
                      <div class="section contact">
                          <h3>👤 Customer Contact Info</h3>
                          <div class="info-grid">
                              <div class="info-item">
                                  <strong>📧 Email</strong>
                                  <span>${customerInfo.email}</span>
                              </div>
                              <div class="info-item">
                                  <strong>📱 Phone</strong>
                                  <span>${customerInfo.phone}</span>
                              </div>
                          </div>
                          <div class="info-item" style="margin-top: 15px;">
                              <strong>🏠 Delivery Address</strong>
                              <span>${customerInfo.address}, ${customerInfo.city}${customerInfo.state ? ", " + customerInfo.state : ""}${customerInfo.zipCode ? " " + customerInfo.zipCode : ""}</span>
                          </div>
                          <div class="contact-actions">
                              <a href="mailto:${customerInfo.email}" class="contact-btn">
                                  📧 Send Email
                              </a>
                              <a href="tel:${customerInfo.phone}" class="contact-btn">
                                  📞 Call Customer
                              </a>
                          </div>
                      </div>
                      
                      <div class="section items">
                          <h3>📦 Order Items</h3>
                          ${items
                            .map(
                              (item) => `
                              <div class="order-item">
                                  <img src="${item.image}" alt="${item.name}" class="product-image" onerror="this.style.display='none'">
                                  <div class="item-details">
                                      <h4>${item.name}</h4>
                                      <p><strong>Category:</strong> ${item.category}</p>
                                      <p><strong>Quantity:</strong> ${item.quantity} × ${item.duration} days</p>
                                      <p><strong>Unit Price:</strong> $${item.unitPrice.toFixed(2)}</p>
                                  </div>
                                  <div class="item-price">$${item.total.toFixed(2)}</div>
                              </div>
                          `,
                            )
                            .join("")}
                      </div>
                      
                      <div class="section pricing">
                          <h3>💰 Pricing Breakdown</h3>
                          <div class="pricing-breakdown">
                              <div class="pricing-row">
                                  <span>Subtotal:</span>
                                  <span>$${pricing.subtotal.toFixed(2)}</span>
                              </div>
                              <div class="pricing-row">
                                  <span>Delivery Fee:</span>
                                  <span>${pricing.shipping === 0 ? "Free 🎉" : "$" + pricing.shipping.toFixed(2)}</span>
                              </div>
                              <div class="pricing-row">
                                  <span>Taxes & Fees:</span>
                                  <span>$${pricing.taxes.toFixed(2)}</span>
                              </div>
                              <div class="pricing-row total">
                                  <span>💎 Total Amount:</span>
                                  <span>$${pricing.total.toFixed(2)}</span>
                              </div>
                          </div>
                      </div>
                      
                      ${
                        customerInfo.specialInstructions
                          ? `
                          <div class="special-instructions">
                              <h4>📝 Special Instructions:</h4>
                              <p style="margin: 0; font-size: 16px; line-height: 1.5;">${customerInfo.specialInstructions}</p>
                          </div>
                      `
                          : ""
                      }
                  </div>
                  
                  <div class="footer">
                      <p><strong>⏰ Received at:</strong> ${new Date().toLocaleString()}</p>
                      <p><strong>🔖 Order ID:</strong> #${orderId}</p>
                      <p style="margin-top: 15px;">🚀 <strong>Next Steps:</strong> Contact customer to confirm details and arrange payment</p>
                  </div>
              </div>
          </body>
          </html>
        `

        // Send to each admin email
        const emailResults = []
        for (const adminEmail of uniqueAdminEmails) {
          try {
            const adminMailOptions = {
              from: process.env.EMAIL_FROM,
              to: adminEmail,
              subject: `🛍️ NEW ORDER ODOMITERENTALS!!! ${customerInfo.firstName} ${customerInfo.lastName} ($${pricing.total.toFixed(2)})`,
              html: adminEmailHTML,
            }

            console.log(`Sending order notification to: ${adminEmail}`)
            const result = await transporter.sendMail(adminMailOptions)

            emailResults.push({
              email: adminEmail,
              success: true,
              messageId: result.messageId,
            })

            console.log(`Order notification sent successfully to ${adminEmail}:`, result.messageId)
          } catch (emailError) {
            console.error(`Failed to send order notification to ${adminEmail}:`, emailError)
            emailResults.push({
              email: adminEmail,
              success: false,
              error: emailError instanceof Error ? emailError.message : "Unknown error",
            })
          }
        }

        const successCount = emailResults.filter((result) => result.success).length
        console.log(`Admin email notifications: ${successCount}/${uniqueAdminEmails.length} sent successfully`)
      }
    } catch (emailError) {
      console.error("Error sending admin email notifications:", {
        error: emailError,
        message: emailError instanceof Error ? emailError.message : "Unknown error",
      })
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order submitted successfully",
    })
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}
