import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const adminRef = adminDb.collection('admin');
    const existingSnapshot = await adminRef.where('email', '==', email).get();
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 409 }
      );
    }

    // Add new admin
    const adminDoc = {
      email: email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const docRef = await adminRef.add(adminDoc);

    return NextResponse.json({ 
      success: true,
      message: 'Admin created successfully',
      adminId: docRef.id
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
