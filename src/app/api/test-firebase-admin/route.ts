import { NextRequest, NextResponse } from 'next/server'
// Import using require since TypeScript path resolution is having issues
const { adminDb } = require('../../../../../firebase-admin')

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase Admin SDK connection...')
    
    // Try to access a simple collection
    const testRef = adminDb.collection('test')
    const testDoc = await testRef.add({
      test: true,
      timestamp: new Date(),
      message: 'Firebase Admin SDK test'
    })
    
    console.log('Test document created with ID:', testDoc.id)
    
    // Delete the test document
    await testDoc.delete()
    console.log('Test document deleted')
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK is working correctly',
      testDocId: testDoc.id
    })
    
  } catch (error) {
    console.error('Firebase Admin SDK test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}
