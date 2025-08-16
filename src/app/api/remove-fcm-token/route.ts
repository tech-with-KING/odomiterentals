import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find and remove the token from Firestore
    const tokensRef = adminDb.collection('admin_fcm_tokens');
    const snapshot = await tokensRef.where('token', '==', token).get();

    if (!snapshot.empty) {
      const batch = adminDb.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { active: false });
      });
      await batch.commit();
    }

    console.log('FCM token deactivated:', token);

    return NextResponse.json({ 
      success: true, 
      message: 'Token removed successfully' 
    });

  } catch (error) {
    console.error('Error removing FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to remove token' },
      { status: 500 }
    );
  }
}
