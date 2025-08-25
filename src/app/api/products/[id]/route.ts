import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../firebase-admin';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    const body = await request.json();
    const { userEmail, productData } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    if (!productData) {
      return NextResponse.json(
        { error: 'Product data is required' },
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

    // Update the product
    const productRef = adminDb.collection('products').doc(productId);
    
    // Add timestamp for last update
    const updatedData = {
      ...productData,
      lastUpdated: new Date().toISOString()
    };

    await productRef.update(updatedData);
    
    return NextResponse.json({ 
      success: true,
      message: 'Product updated successfully',
      productId: productId
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    
    const productRef = adminDb.collection('products').doc(productId);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productData = {
      id: productDoc.id,
      ...productDoc.data()
    };
    
    return NextResponse.json({ product: productData });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
