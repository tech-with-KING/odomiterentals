import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limitCount = searchParams.get('limit');

    // Check if user is admin for admin operations
    if (userEmail) {
      const adminRef = adminDb.collection('admin');
      const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
      
      if (adminSnapshot.empty) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
    }

    let query = adminDb.collection('orders').orderBy('createdAt', 'desc');
    
    // Filter by user ID if provided (for user-specific orders)
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    // Filter by status if provided
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Apply limit if provided
    if (limitCount) {
      query = query.limit(parseInt(limitCount));
    }
    
    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData, userEmail } = body;

    if (!orderData) {
      return NextResponse.json(
        { error: 'Order data is required' },
        { status: 400 }
      );
    }

    // For order creation, we might want to allow both users and admins
    // Users can create orders, admins can create orders on behalf of users
    if (userEmail) {
      // Optional: Check if user is admin (for admin-created orders)
      const adminRef = adminDb.collection('admin');
      const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
      
      if (!adminSnapshot.empty) {
        console.log('Order created by admin:', userEmail);
      }
    }

    // Add timestamps
    const orderWithTimestamps = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await adminDb.collection('orders').add(orderWithTimestamps);
    
    return NextResponse.json({ 
      success: true,
      orderId: docRef.id,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
