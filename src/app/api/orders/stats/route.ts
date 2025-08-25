import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Check if user is admin
    const adminRef = adminDb.collection('admin');
    const adminSnapshot = await adminRef.where('email', '==', userEmail).get();
    
    if (adminSnapshot.empty) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    // Get all orders for statistics
    const ordersSnapshot = await adminDb.collection('orders').get();
    const orders = ordersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === 'pending').length,
      confirmed: orders.filter((o: any) => o.status === 'confirmed').length,
      completed: orders.filter((o: any) => o.status === 'completed').length,
      totalRevenue: orders
        .filter((o: any) => o.paymentStatus === 'paid')
        .reduce((sum: number, o: any) => sum + (o.pricing?.total || 0), 0)
    };
    
    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
