import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { adminDb } from '../../../../../firebase-admin-new'

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, quantity, duration } = await request.json()
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Get current cart
    const cartRef = adminDb.collection('carts').doc(userId)
    const cartSnap = await cartRef.get()
    
    if (!cartSnap.exists) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const cartData = cartSnap.data()
    let currentItems = cartData?.items || []

    // Update the specific item
    const updatedItems = currentItems.map((item: any) => {
      if (item.id === itemId) {
        const newQuantity = quantity !== undefined ? Math.max(1, quantity) : item.quantity
        const newDuration = duration !== undefined ? Math.max(1, duration) : item.duration
        
        return {
          ...item,
          quantity: newQuantity,
          duration: newDuration,
          total: newQuantity * newDuration * item.unitPrice
        }
      }
      return item
    })

    // Save updated cart
    const totalItems = updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalAmount = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0)

    const updatedCartData = {
      userId,
      items: updatedItems,
      updatedAt: new Date(),
      totalItems,
      totalAmount
    }

    await cartRef.set(updatedCartData, { merge: true })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    // Get current cart
    const cartRef = adminDb.collection('carts').doc(userId)
    const cartSnap = await cartRef.get()
    
    if (!cartSnap.exists) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const cartData = cartSnap.data()
    const currentItems = cartData?.items || []

    // Remove the specific item
    const updatedItems = currentItems.filter((item: any) => item.id !== itemId)

    // Save updated cart
    const totalItems = updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalAmount = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0)

    const updatedCartData = {
      userId,
      items: updatedItems,
      updatedAt: new Date(),
      totalItems,
      totalAmount
    }

    await cartRef.set(updatedCartData, { merge: true })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 })
  }
}
