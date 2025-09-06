import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // This will help you check what upload presets exist in your Cloudinary account
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_CLOUD_API_KEY;
  const apiSecret = process.env.CLOUDINARY_CLOUD_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        error: 'Missing Cloudinary configuration',
        config: {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret
        }
      }, { status: 400 });
    }

    // Create authorization header
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    // Fetch upload presets from Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload_presets`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch upload presets',
        status: response.status,
        statusText: response.statusText
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      cloudName,
  currentPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      availablePresets: data.presets?.map((preset: any) => ({
        name: preset.name,
        unsigned: preset.unsigned,
        settings: {
          folder: preset.settings?.folder,
          resource_type: preset.settings?.resource_type,
          access_mode: preset.settings?.access_mode
        }
      })) || [],
      recommendation: data.presets?.length > 0 
        ? `Use one of the existing presets above, or create 'odomite_products' as unsigned preset`
        : 'Create a new unsigned upload preset named "odomite_products" in your Cloudinary dashboard'
    });

  } catch (error) {
    console.error('Error checking Cloudinary presets:', error);
    return NextResponse.json({
      error: 'Failed to check upload presets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
