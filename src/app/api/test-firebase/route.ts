import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Firebase Admin initialization
    console.log('Testing Firebase Admin initialization...');
    
    // Check environment variables
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
    
    console.log('Environment variables check:', {
      hasProjectId,
      hasClientEmail,
      hasPrivateKey,
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) + '...'
    });

    // Try to import Firebase Admin
    const { adminDb } = await import('../../../../firebase-admin');
    
    // Test a simple Firestore operation
    console.log('Testing Firestore connection...');
    const testRef = adminDb.collection('test');
    const timestamp = new Date().toISOString();
    
    // Try to write a test document
    await testRef.doc('connection-test').set({
      timestamp,
      message: 'Firebase Admin connection test',
      environment: process.env.NODE_ENV || 'unknown'
    });
    
    // Try to read it back
    const doc = await testRef.doc('connection-test').get();
    const data = doc.data();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin is working correctly',
      environment: {
        hasProjectId,
        hasClientEmail,
        hasPrivateKey,
        projectId: process.env.FIREBASE_PROJECT_ID,
        nodeEnv: process.env.NODE_ENV
      },
      testData: data,
      timestamp
    });

  } catch (error) {
    console.error('Firebase Admin test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Firebase Admin test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
