import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../firebase-admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const userId = searchParams.get('userId');

    // Check permissions: admin can access any order, users can only access their own
    if (userEmail) {
      const adminRef = adminDb.collection('admin');
      const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
      
      if (adminSnapshot.empty && !userId) {
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    
    // If not admin, check if user owns this order
    if (userId && orderData?.userId !== userId) {
      const adminRef = adminDb.collection('admin');
      const adminSnapshot = await adminRef.where('email', '==', userEmail || '').get();
      
      if (adminSnapshot.empty) {
        return NextResponse.json(
          { error: 'Unauthorized: You can only access your own orders' },
          { status: 403 }
        );
      }
    }

    const order = {
      id: orderDoc.id,
      ...orderData,
      // Convert Firestore timestamps to ISO strings
      createdAt: orderData?.createdAt?.toDate?.()?.toISOString() || orderData?.createdAt,
      updatedAt: orderData?.updatedAt?.toDate?.()?.toISOString() || orderData?.updatedAt,
    };
    
    return NextResponse.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { userEmail, updates } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    if (!updates) {
      return NextResponse.json(
        { error: 'Updates are required' },
        { status: 400 }
      );
    }

    // Check if user is admin (only admins can update orders)
    const adminRef = adminDb.collection('admin');
    const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
    
    if (adminSnapshot.empty) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required for order updates' },
        { status: 403 }
      );
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    
    // Add updated timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await orderRef.update(updateData);
    
    return NextResponse.json({ 
      success: true,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Check if user is admin (only admins can delete orders)
    const adminRef = adminDb.collection('admin');
    const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
    
    if (adminSnapshot.empty) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required for order deletion' },
        { status: 403 }
      );
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    await orderRef.delete();
    
    return NextResponse.json({ 
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
