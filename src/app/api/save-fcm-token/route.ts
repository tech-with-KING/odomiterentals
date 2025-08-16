import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token, userEmail } = await request.json();

    if (!token || !userEmail) {
      return NextResponse.json(
        { error: 'Token and userEmail are required' },
        { status: 400 }
      );
    }

    // Save the FCM token to Firestore
    await adminDb.collection('admin_fcm_tokens').doc(userEmail).set({
      token,
      userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true
    });

    console.log('FCM token saved for user:', userEmail);

    return NextResponse.json({ 
      success: true, 
      message: 'Token saved successfully' 
    });

  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 }
    );
  }
}
