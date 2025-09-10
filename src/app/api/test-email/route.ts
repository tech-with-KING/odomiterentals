import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number.parseInt(process.env.SMTP_PORT || '587'),
    secure: Number.parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_AUTH_USER || process.env.EMAIL_FROM, // Use separate auth user if available
      pass: process.env.EMAIL_PASSWORD,
    },
  // debug/logger removed for production
  })
}

export async function POST(request: NextRequest) {
  try {
    // Diagnostics removed for production - keep minimal checks
    
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
    try {
      await transporter.verify()
    } catch (verifyErr) {
      console.error('SMTP verification failed:', verifyErr)
      return NextResponse.json({
        error: 'SMTP verification failed',
        details: verifyErr instanceof Error ? verifyErr.message : String(verifyErr),
      }, { status: 500 })
    }
    
    // Get admin emails
    const adminEmails = [
      process.env.ADMIN_EMAIL,
      process.env.BUSINESS_EMAIL,
      process.env.EMAIL_FROM
    ].filter(email => email && email.trim() !== '');
    
    // Add extra admin emails if configured
    if (process.env.EXTRA_ADMIN_EMAILS) {
      const extraEmails = process.env.EXTRA_ADMIN_EMAILS.split(',')
        .map(email => email.trim())
        .filter(email => email !== '');
      adminEmails.push(...extraEmails);
    }
    
    // Remove duplicates
    const uniqueAdminEmails = [...new Set(adminEmails)];
    
  // Sending test emails to admin addresses
    
    if (uniqueAdminEmails.length === 0) {
      return NextResponse.json({
        error: 'No admin emails configured'
      }, { status: 400 });
    }
    
    const emailResults = [];
    
    // Send test email to each admin
    for (const adminEmail of uniqueAdminEmails) {
      try {
  // sending to each admin
        const result = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: adminEmail,
          subject: '🔔 Test: Admin Email Notification - Odomite Rentals',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
                <h1>🔔 Admin Email Test</h1>
              </div>
              <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #16a34a;">✅ Email System Working!</h2>
                <p>This is a test email to verify that admin email notifications are working correctly.</p>
                
                <h3>Test Details:</h3>
                <ul>
                  <li><strong>Sent to:</strong> ${adminEmail}</li>
                  <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>System:</strong> Order Notification System</li>
                  <li><strong>Status:</strong> Active ✅</li>
                </ul>
                
                <div style="background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                  <h4>When a real order is placed, you will receive:</h4>
                  <ul>
                    <li>Customer contact information</li>
                    <li>Detailed order items and quantities</li>
                    <li>Pricing breakdown and total</li>
                    <li>Rental dates and special instructions</li>
                    <li>Direct WhatsApp contact link</li>
                  </ul>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                  This is an automated test email from Odomite Rentals admin notification system.
                  <br>If you received this, the email system is properly configured! 🎉
                </p>
              </div>
            </div>
          `
        });
        
        emailResults.push({
          email: adminEmail,
          success: true,
          messageId: result.messageId
        });
        
  // success
        
      } catch (emailError) {
        console.error(`Failed to send test email to ${adminEmail}:`, emailError);
        emailResults.push({
          email: adminEmail,
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        });
      }
    }
    
    const successCount = emailResults.filter(result => result.success).length;
    const totalCount = emailResults.length;
    
    return NextResponse.json({
      success: successCount > 0,
      message: `Test emails sent successfully to ${successCount}/${totalCount} admin emails`,
      results: emailResults,
      adminEmails: uniqueAdminEmails,
      totalSent: successCount,
      totalFailed: totalCount - successCount
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
