import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing notification systems...');
    
    const testOrderData = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      total: 99.99,
      itemCount: 3
    };
    
    const results = {
      email: { success: false, message: '', details: null as any },
      push: { success: false, message: '', details: null as any }
    };
    
    // Test email notifications
    try {
      console.log('Testing email notification system...');
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        results.email = {
          success: true,
          message: emailResult.message,
          details: emailResult
        };
        console.log('Email notification test successful:', emailResult);
      } else {
        const errorText = await emailResponse.text();
        results.email = {
          success: false,
          message: 'Email test failed',
          details: errorText
        };
        console.error('Email notification test failed:', errorText);
      }
    } catch (emailError) {
      results.email = {
        success: false,
        message: 'Email test error',
        details: emailError instanceof Error ? emailError.message : 'Unknown error'
      };
      console.error('Email notification test error:', emailError);
    }
    
    // Test push notifications (will likely fail until Firebase is properly configured)
    try {
      console.log('Testing push notification system...');
      const pushResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData)
      });

      if (pushResponse.ok) {
        const pushResult = await pushResponse.json();
        results.push = {
          success: true,
          message: pushResult.message,
          details: pushResult
        };
        console.log('Push notification test successful:', pushResult);
      } else {
        const errorText = await pushResponse.text();
        results.push = {
          success: false,
          message: 'Push notification test failed',
          details: errorText
        };
        console.error('Push notification test failed:', errorText);
      }
    } catch (pushError) {
      results.push = {
        success: false,
        message: 'Push notification test error',
        details: pushError instanceof Error ? pushError.message : 'Unknown error'
      };
      console.error('Push notification test error:', pushError);
    }
    
    const overallSuccess = results.email.success || results.push.success;
    const workingSystems = [];
    const failingSystems = [];
    
    if (results.email.success) workingSystems.push('Email');
    else failingSystems.push('Email');
    
    if (results.push.success) workingSystems.push('Push Notifications');
    else failingSystems.push('Push Notifications');
    
    return NextResponse.json({
      success: overallSuccess,
      message: overallSuccess 
        ? `Notification test completed. Working: ${workingSystems.join(', ')}${failingSystems.length ? `. Not working: ${failingSystems.join(', ')}` : ''}`
        : 'All notification systems failed',
      results,
      summary: {
        working: workingSystems,
        failing: failingSystems,
        emailWorking: results.email.success,
        pushWorking: results.push.success
      }
    });

  } catch (error) {
    console.error('Error in notification test:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test notification systems',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
