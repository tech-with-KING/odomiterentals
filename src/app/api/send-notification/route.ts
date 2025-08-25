import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '../../../../firebase-admin';

interface NotificationData {
  orderId: string;
  customerName: string;
  total: number;
  itemCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const notificationData: NotificationData = await request.json();
    
    const { orderId, customerName, total, itemCount } = notificationData;

    if (!orderId || !customerName) {
      return NextResponse.json(
        { error: 'Order ID and customer name are required' },
        { status: 400 }
      );
    }

    // Get all active admin FCM tokens
    const tokensSnapshot = await adminDb
      .collection('admin_fcm_tokens')
      .where('active', '==', true)
      .get();

    if (tokensSnapshot.empty) {
      console.log('No active admin tokens found');
      return NextResponse.json({ 
        success: false, 
        message: 'No admin devices to notify' 
      });
    }

    const tokens = tokensSnapshot.docs.map((doc: any) => doc.data().token);

    // Prepare the notification message
    const message = {
      notification: {
        title: '🛍️ New Order Received!',
        body: `${customerName} placed an order for $${total.toFixed(2)} (${itemCount} items)`,
      },
      data: {
        orderId,
        customerName,
        total: total.toString(),
        itemCount: itemCount.toString(),
        timestamp: new Date().toISOString(),
        action: 'new_order'
      },
      tokens
    };

    // Send the notification to all admin devices
    const response = await adminMessaging.sendEachForMulticast(message);
    
    console.log('Push notification sent:', {
      successCount: response.successCount,
      failureCount: response.failureCount,
      orderId
    });

    // Handle failed tokens (remove them from database)
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp: any, idx: number) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error('Failed to send to token:', tokens[idx], resp.error);
        }
      });

      // Deactivate failed tokens
      if (failedTokens.length > 0) {
        const batch = adminDb.batch();
        const tokensRef = adminDb.collection('admin_fcm_tokens');
        
        for (const failedToken of failedTokens) {
          const tokenSnapshot = await tokensRef.where('token', '==', failedToken).get();
          tokenSnapshot.docs.forEach((doc: any) => {
            batch.update(doc.ref, { active: false });
          });
        }
        
        await batch.commit();
        console.log('Deactivated failed tokens:', failedTokens.length);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
      successCount: response.successCount,
      failureCount: response.failureCount
    });

  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
