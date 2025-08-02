import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing Cloudinary configuration...')
    
    // Check environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    
    console.log('Environment variables:', {
      cloudName: cloudName ? 'Set' : 'Not set',
      uploadPreset: uploadPreset ? 'Set' : 'Not set',
      actualCloudName: cloudName,
      actualUploadPreset: uploadPreset
    })
    
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({
        error: 'Cloudinary configuration missing',
        details: {
          cloudName: cloudName ? 'Set' : 'Missing',
          uploadPreset: uploadPreset ? 'Set' : 'Missing'
        }
      }, { status: 400 })
    }
    
    // Test if we can reach Cloudinary API
    const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    console.log('Testing URL:', testUrl)
    
    // Create a simple test request (this will fail but should give us useful error info)
    const testFormData = new FormData()
    testFormData.append('upload_preset', uploadPreset)
    testFormData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') // 1x1 transparent PNG
    
    const response = await fetch(testUrl, {
      method: 'POST',
      body: testFormData,
    })
    
    const responseText = await response.text()
    console.log('Test response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    })
    
    if (response.ok) {
      const data = JSON.parse(responseText)
      return NextResponse.json({
        success: true,
        message: 'Cloudinary configuration is working!',
        testUpload: {
          publicId: data.public_id,
          secureUrl: data.secure_url
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Cloudinary test failed',
        error: responseText,
        status: response.status
      }, { status: 200 }) // Return 200 so we can see the error details
    }
    
  } catch (error) {
    console.error('Cloudinary test failed:', error)
    
    return NextResponse.json({
      error: 'Cloudinary test failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}
