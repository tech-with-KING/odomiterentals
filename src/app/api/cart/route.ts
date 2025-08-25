import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { adminDb } from '../../../../firebase-admin-new'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartRef = adminDb.collection('carts').doc(userId)
    const cartSnap = await cartRef.get()
    
    if (cartSnap.exists) {
      const data = cartSnap.data()
      return NextResponse.json(data?.items || [])
    }
    
    return NextResponse.json([])
  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await request.json()
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 })
    }

    const cartRef = adminDb.collection('carts').doc(userId)
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.total, 0)

    const cartData = {
      userId,
      items,
      updatedAt: new Date(),
      totalItems,
      totalAmount
    }

    await cartRef.set(cartData, { merge: true })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving cart:', error)
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartRef = adminDb.collection('carts').doc(userId)
    await cartRef.set({
      userId,
      items: [],
      updatedAt: new Date(),
      totalItems: 0,
      totalAmount: 0
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
