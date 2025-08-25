import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get all products to extract categories from them
    const productsRef = adminDb.collection('products');
    const snapshot = await productsRef.get();
    
    const categoriesSet = new Set<string>();
    
    // Extract categories from products
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      
      // Handle different possible field names for categories
      let productCategories: string[] = [];
      if (data.categories && Array.isArray(data.categories)) {
        productCategories = data.categories;
      } else if (data.category && Array.isArray(data.category)) {
        productCategories = data.category;
      } else if (typeof data.category === 'string') {
        productCategories = [data.category];
      }
      
      // Add each category to the set (removes duplicates automatically)
      productCategories.forEach((category: string) => {
        if (category && category.trim()) {
          categoriesSet.add(category.trim());
        }
      });
    });

    // Convert set to array of category objects
    const categories = Array.from(categoriesSet).map(category => ({
      id: category.toLowerCase().replace(/[^a-z0-9]/g, '-'), // Create a URL-friendly ID
      name: category,
      slug: category.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }));

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { 
        error: 'Categories cannot be added directly. Categories are managed through product data. Please add categories when creating or updating products.' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in categories POST:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
