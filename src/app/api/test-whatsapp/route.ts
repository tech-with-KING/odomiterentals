import { NextRequest, NextResponse } from 'next/server'

// Generate WhatsApp test message
const generateTestWhatsAppMessage = () => {
  const message = `🧪 *TEST MESSAGE* - Odomite Rentals WhatsApp Integration

👤 *Test Customer Details:*
Name: John Doe
📧 Email: john.doe@example.com
📱 Phone: +1234567890
📍 Address: 123 Test Street, Test City
State: Test State
ZIP: 12345
📅 Rental Start: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

🛒 *Test Order Items:*
1. Test Product A
   • Qty: 2 × 3 days
   • Price: $150.00

2. Test Product B
   • Qty: 1 × 5 days
   • Price: $200.00

💰 *Order Total:*
Subtotal: $350.00
Delivery: Free
Taxes: $28.00
*Total: $378.00*

📝 *Special Instructions:*
This is a test message to verify WhatsApp integration is working properly.

🕒 Test Date: ${new Date().toLocaleString()}

---
This is an automated test from Odomite Rentals system.`
  
  return encodeURIComponent(message)
}

export async function POST(request: NextRequest) {
  try {
    console.log('Testing WhatsApp integration...')
    
    // Check environment variables
    console.log('Environment variables:', {
      BUSINESS_WHATSAPP_NUMBER: process.env.BUSINESS_WHATSAPP_NUMBER ? 'Set' : 'Not set',
      BUSINESS_EMAIL: process.env.BUSINESS_EMAIL ? 'Set' : 'Not set'
    })
    
    if (!process.env.BUSINESS_WHATSAPP_NUMBER) {
      return NextResponse.json({
        error: 'WhatsApp configuration not found',
        details: {
          BUSINESS_WHATSAPP_NUMBER: 'Missing - required for WhatsApp integration'
        }
      }, { status: 400 })
    }
    
    // Get test phone number from request body (optional)
    const body = await request.json().catch(() => ({}))
    const { testPhoneNumber } = body
    
    // Generate test WhatsApp message
    const encodedMessage = generateTestWhatsAppMessage()
    
    // Create WhatsApp URLs
    const businessWhatsAppUrl = `https://wa.me/${process.env.BUSINESS_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    
    let testPhoneUrl = null
    if (testPhoneNumber) {
      const cleanTestNumber = testPhoneNumber.replace(/[^0-9]/g, '')
      testPhoneUrl = `https://wa.me/${cleanTestNumber}?text=${encodedMessage}`
    }
    
    console.log('WhatsApp URLs generated successfully')
    console.log('Business WhatsApp URL length:', businessWhatsAppUrl.length)
    
    return NextResponse.json({
      success: true,
      message: 'WhatsApp test URLs generated successfully',
      data: {
        businessWhatsAppNumber: process.env.BUSINESS_WHATSAPP_NUMBER,
        testPhoneNumber: testPhoneNumber || null,
        urls: {
          businessWhatsApp: businessWhatsAppUrl,
          testPhone: testPhoneUrl
        },
        messagePreview: decodeURIComponent(encodedMessage).substring(0, 200) + '...',
        instructions: {
          howToTest: [
            '1. Copy the businessWhatsApp URL from the response',
            '2. Open it in your browser',
            '3. It should open WhatsApp with the pre-filled message',
            '4. Send the message to test the integration'
          ],
          notes: [
            'The URL will open WhatsApp Web or the WhatsApp app',
            'Make sure WhatsApp is installed or accessible',
            'The message is URL-encoded for proper transmission'
          ]
        }
      }
    })
    
  } catch (error) {
    console.error('WhatsApp test failed:', error)
    
    return NextResponse.json({
      error: 'WhatsApp test failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp Test Endpoint',
    description: 'Send a POST request to test WhatsApp integration',
    usage: {
      method: 'POST',
      body: {
        testPhoneNumber: 'optional - phone number to generate test URL for (e.g., +1234567890)'
      }
    },
    currentConfig: {
      businessWhatsApp: process.env.BUSINESS_WHATSAPP_NUMBER ? 'Configured' : 'Not configured'
    }
  })
}
