import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const categoriesRef = adminDb.collection('categories');
    const snapshot = await categoriesRef.get();
    
    const categories = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, categoryData } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    if (!categoryData) {
      return NextResponse.json(
        { error: 'Category data is required' },
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

    // Add timestamps to category data
    const categoryWithTimestamps = {
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection('categories').add(categoryWithTimestamps);
    
    return NextResponse.json({ 
      success: true,
      message: 'Category created successfully',
      categoryId: docRef.id 
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
