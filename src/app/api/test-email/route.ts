import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Testing email configuration...')
    
    // Check environment variables
    console.log('Environment variables:', {
      EMAIL_FROM: process.env.EMAIL_FROM ? 'Set' : 'Not set',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set',
      BUSINESS_EMAIL: process.env.BUSINESS_EMAIL ? 'Set' : 'Not set'
    })
    
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json({
        error: 'Email environment variables not configured',
        details: {
          EMAIL_FROM: process.env.EMAIL_FROM ? 'Set' : 'Missing',
          EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Missing'
        }
      }, { status: 400 })
    }
    
    const transporter = createTransporter()
    
    // Test connection
    console.log('Testing SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified successfully')
    
    // Get test email from request body
    const { testEmail } = await request.json()
    const recipientEmail = testEmail || process.env.EMAIL_FROM
    
    // Send test email
    console.log('Sending test email to:', recipientEmail)
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: 'Test Email - Odomite Rentals',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration is working.</p>
        <p>If you receive this email, your email setup is working correctly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    })
    
    console.log('Test email sent successfully:', result.messageId)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      recipient: recipientEmail
    })
    
  } catch (error) {
    console.error('Email test failed:', error)
    
    return NextResponse.json({
      error: 'Email test failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error && 'code' in error ? error.code : undefined
      }
    }, { status: 500 })
  }
}
