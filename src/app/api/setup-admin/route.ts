import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secret } = body;

    // Simple security check
    if (secret !== 'admin-setup-secret-2025') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Setting up admin for email:', email);

    // Check if admin already exists
    const adminsRef = adminDb.collection('admins');
    const existingSnapshot = await adminsRef.where('email', '==', email).get();
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { message: 'Admin already exists', email }
      );
    }

    // Add new admin
    const adminDoc = {
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      isActive: true,
      role: 'admin'
    };

    const docRef = await adminsRef.add(adminDoc);
    console.log('Admin added with ID:', docRef.id);

    return NextResponse.json({ 
      success: true,
      message: 'Admin created successfully',
      adminId: docRef.id,
      email: email
    });

  } catch (error) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup admin', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
