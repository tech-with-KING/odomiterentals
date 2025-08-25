import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminApp } from '../../../../firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase Admin connection...');
    
    // Test 1: Check if adminDb is initialized
    console.log('AdminDb initialized:', !!adminDb);
    console.log('AdminApp initialized:', !!adminApp);
    
    // Test 2: Try to get a simple collection reference (no query)
    const adminRef = adminDb.collection('admin');
    console.log('Collection reference created:', !!adminRef);
    
    // Test 3: Try a simple query
    console.log('Attempting to query admin collection...');
    const snapshot = await adminRef.limit(1).get();
    console.log('Query successful. Docs count:', snapshot.size);
    
    return NextResponse.json({ 
      success: true,
      message: 'Firebase Admin connection test successful',
      docsFound: snapshot.size,
      adminDbInitialized: !!adminDb,
      adminAppInitialized: !!adminApp
    });

  } catch (error) {
    console.error('Firebase Admin connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Firebase Admin connection test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
