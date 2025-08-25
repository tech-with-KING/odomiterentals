import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function GET() {
  try {
    console.log('Testing Firebase Admin connection...');
    
    // Test basic connection
    console.log('AdminDb object:', !!adminDb);
    
    // Try to add a test admin user
    const adminsRef = adminDb.collection('admins');
    
    // Add test admin - replace with your actual Clerk email
    const testAdmin = {
      email: 'test@example.com', // Replace this with your actual Clerk login email
      name: 'Test Admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const docRef = await adminsRef.add(testAdmin);
    console.log('Test admin added with ID:', docRef.id);

    return NextResponse.json({ 
      success: true,
      message: 'Firebase Admin connection working!',
      testAdminId: docRef.id
    });

  } catch (error) {
    console.error('Firebase Admin test error:', error);
    return NextResponse.json(
      { 
        error: 'Firebase Admin test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
