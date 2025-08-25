import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '../../../../firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkUserId, email, isAdmin } = body;

    if (!clerkUserId || !email) {
      return NextResponse.json(
        { error: 'Clerk user ID and email are required' },
        { status: 400 }
      );
    }

    const auth = getAuth(adminApp);
    
    // Create custom claims for Firebase
    const customClaims = {
      clerk_user_id: clerkUserId,
      email: email,
      admin: isAdmin || false
    };

    // Create a custom token
    const customToken = await auth.createCustomToken(clerkUserId, customClaims);

    return NextResponse.json({ 
      customToken,
      message: 'Custom token created successfully'
    });

  } catch (error) {
    console.error('Error creating custom token:', error);
    return NextResponse.json(
      { error: 'Failed to create custom token', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
