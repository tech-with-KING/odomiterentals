import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Checking admin status for email:', email);

    // Check if user is admin in the admin collection
    const adminRef = adminDb.collection('admin');
    const snapshot = await adminRef.where('email', '==', email).get();
    
    console.log('Query executed successfully. Empty:', snapshot.empty);
    
    const isAdmin = !snapshot.empty;

    return NextResponse.json({ 
      isAdmin,
      message: isAdmin ? 'User is an admin' : 'User is not an admin',
      email: email
    });

  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check admin status', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
