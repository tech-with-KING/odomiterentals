import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const apiKey = process.env.CLOUDINARY_CLOUD_API_KEY;
  const apiSecret = process.env.CLOUDINARY_CLOUD_API_SECRET;

    console.log('Cloudinary Environment Check:', {
      cloudName: cloudName ? 'Set' : 'Missing',
      uploadPreset: uploadPreset ? 'Set' : 'Missing',
      apiKey: apiKey ? 'Set' : 'Missing',
      apiSecret: apiSecret ? 'Set' : 'Missing',
      environment: process.env.NODE_ENV || 'unknown'
    });

    // Test if we can reach Cloudinary
    let presetExists = false;
    let presetDetails = null;
    let error = null;

    if (cloudName && uploadPreset) {
      try {
        // Test the upload preset by making a simple request
        const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        console.log('Testing Cloudinary URL:', testUrl);
        console.log('Using upload preset:', uploadPreset);

        // Create a simple test form data
        const formData = new FormData();
        formData.append('upload_preset', uploadPreset);
        formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='); // 1x1 transparent pixel

        const uploadResponse = await fetch(testUrl, {
          method: 'POST',
          body: formData
        });

        console.log('Upload test response status:', uploadResponse.status);
        
        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          presetExists = true;
          presetDetails = {
            public_id: result.public_id,
            url: result.secure_url,
            status: 'success'
          };
        } else {
          const errorText = await uploadResponse.text();
          console.log('Upload test error:', errorText);
          error = errorText;
        }
      } catch (testError) {
        console.error('Upload test failed:', testError);
        error = testError instanceof Error ? testError.message : 'Unknown test error';
      }
    }

    return NextResponse.json({
      environment: process.env.NODE_ENV || 'unknown',
      cloudinaryConfig: {
        cloudName: cloudName || 'MISSING',
        uploadPreset: uploadPreset || 'MISSING',
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      },
      test: {
        presetExists,
        presetDetails,
        error
      },
      recommendations: [
  !cloudName && 'Set CLOUDINARY_CLOUD_NAME in production environment',
  !uploadPreset && 'Set CLOUDINARY_UPLOAD_PRESET in production environment',
        error && error.includes('Upload preset not found') && 'Create an unsigned upload preset in your Cloudinary dashboard',
        error && error.includes('Invalid') && 'Check your Cloudinary cloud name and upload preset configuration',
      ].filter(Boolean),
      productionSteps: [
        '1. Verify all NEXT_PUBLIC_CLOUDINARY_* environment variables are set in production',
        '2. Ensure upload preset exists and is configured as "unsigned" in Cloudinary dashboard',
        '3. Check that environment variables are exactly the same as local (no extra quotes or spaces)',
        '4. Redeploy your application after setting environment variables'
      ]
    });

  } catch (error) {
    console.error('Cloudinary debug error:', error);
    return NextResponse.json({
      error: 'Failed to debug Cloudinary configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV || 'unknown'
    }, { status: 500 });
  }
}
