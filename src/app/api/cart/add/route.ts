import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { adminDb } from '../../../../../firebase-admin-new'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity = 1, duration = 1 } = await request.json()
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get product details
    const productRef = adminDb.collection('products').doc(productId)
    const productSnap = await productRef.get()
    
    if (!productSnap.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = productSnap.data()
    
    // Get current cart
    const cartRef = adminDb.collection('carts').doc(userId)
    const cartSnap = await cartRef.get()
    
    let currentItems = []
    if (cartSnap.exists) {
      const cartData = cartSnap.data()
      currentItems = cartData?.items || []
    }

    // Check if item already exists
    const existingItemIndex = currentItems.findIndex((item: any) => item.productId === productId)
    let addedItem: any = null

    if (existingItemIndex > -1) {
      // Update existing item
      currentItems[existingItemIndex].quantity += quantity
      currentItems[existingItemIndex].total = 
        currentItems[existingItemIndex].quantity * 
        currentItems[existingItemIndex].duration * 
        currentItems[existingItemIndex].unitPrice
      addedItem = currentItems[existingItemIndex]
    } else {
      // Add new item
      const newItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        name: product?.name || 'Unknown Product',
        image: product?.images?.[0] || '',
        quantity,
        duration,
        unitPrice: parseFloat(product?.price?.toString() || '0'),
        total: quantity * duration * parseFloat(product?.price?.toString() || '0'),
        category: product?.categories?.[0] || 'General',
        addedAt: new Date()
      }
      currentItems.push(newItem)
      addedItem = newItem
    }

    // Save updated cart
    const totalItems = currentItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalAmount = currentItems.reduce((sum: number, item: any) => sum + item.total, 0)

    const cartData = {
      userId,
      items: currentItems,
      updatedAt: new Date(),
      totalItems,
      totalAmount
    }

    await cartRef.set(cartData, { merge: true })
    
    return NextResponse.json({ success: true, item: addedItem })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}
