import { NextRequest, NextResponse } from 'next/server';
import { getAppBaseUrl } from '@/lib/app-url';

export async function POST(request: NextRequest) {
  try {
    // Send a test notification
    const notificationResponse = await fetch(`${getAppBaseUrl(request)}/api/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: 'TEST-' + Date.now(),
        customerName: 'Test Customer',
        total: 99.99,
        itemCount: 3
      })
    });

    const result = await notificationResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      result
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}
