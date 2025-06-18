import { Router } from "itty-router"
import type { Cart, Product, Session, CartItem } from "../types"
import { generateId, requireAuth } from "../utils/auth"
import { createJsonResponse, createErrorResponse } from "../utils/cors"

export function createCartRoutes(carts: Cart[], products: Product[], sessions: Session[]) {
  const router = Router()

  // Get user's cart
  router.get("/", (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    let cart = carts.find((c) => c.userId === userId)

    if (!cart) {
      cart = {
        id: generateId(),
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      carts.push(cart)
    }

    // Populate product details
    const cartWithProducts = {
      ...cart,
      items: cart.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          ...item,
          product: product || null,
        }
      }),
    }

    // Calculate totals
    const totals = cartWithProducts.items.reduce(
      (acc, item) => {
        if (item.product && item.product.pricing?.rental?.weekly) {
          const weeklyRate = item.product.pricing.rental.weekly
          const itemTotal = weeklyRate * item.quantity * item.duration
          acc.subtotal += itemTotal
        }
        return acc
      },
      { subtotal: 0 },
    )

    return createJsonResponse({ ...cartWithProducts, totals })
  })

  // Add item to cart
  router.post("/items", async (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    try {
      const { productId, quantity = 1, duration = 1, startDate, endDate } = await request.json()

      if (!productId) {
        return createErrorResponse("Product ID is required")
      }

      // Validate product exists
      const product = products.find((p) => p.id === productId)
      if (!product) {
        return createErrorResponse("Product not found", 404)
      }

      if (product.availability.status !== "available") {
        return createErrorResponse("Product is not available")
      }

      // Find or create cart
      let cart = carts.find((c) => c.userId === userId)
      if (!cart) {
        cart = {
          id: generateId(),
          userId,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        carts.push(cart)
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId && item.startDate === startDate,
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity
        cart.items[existingItemIndex].updatedAt = new Date().toISOString()
      } else {
        // Add new item
        const cartItem: CartItem = {
          id: generateId(),
          productId,
          quantity,
          duration,
          startDate,
          endDate,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        cart.items.push(cartItem)
      }

      cart.updatedAt = new Date().toISOString()

      return createJsonResponse({ message: "Item added to cart", cart }, 201)
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Update cart item
  router.put("/items/:itemId", async (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    try {
      const itemId = request.params?.itemId
      const { quantity, duration, startDate, endDate } = await request.json()

      const cart = carts.find((c) => c.userId === userId)
      if (!cart) {
        return createErrorResponse("Cart not found", 404)
      }

      const itemIndex = cart.items.findIndex((item) => item.id === itemId)
      if (itemIndex === -1) {
        return createErrorResponse("Cart item not found", 404)
      }

      // Update item
      if (quantity !== undefined) cart.items[itemIndex].quantity = quantity
      if (duration !== undefined) cart.items[itemIndex].duration = duration
      if (startDate !== undefined) cart.items[itemIndex].startDate = startDate
      if (endDate !== undefined) cart.items[itemIndex].endDate = endDate
      cart.items[itemIndex].updatedAt = new Date().toISOString()

      cart.updatedAt = new Date().toISOString()

      return createJsonResponse({ message: "Cart item updated", cart })
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Remove item from cart
  router.delete("/items/:itemId", (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    const itemId = request.params?.itemId

    const cart = carts.find((c) => c.userId === userId)
    if (!cart) {
      return createErrorResponse("Cart not found", 404)
    }

    const itemIndex = cart.items.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) {
      return createErrorResponse("Cart item not found", 404)
    }

    cart.items.splice(itemIndex, 1)
    cart.updatedAt = new Date().toISOString()

    return createJsonResponse({ message: "Item removed from cart" })
  })

  // Clear entire cart
  router.delete("/", (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    const cartIndex = carts.findIndex((c) => c.userId === userId)
    if (cartIndex !== -1) {
      carts.splice(cartIndex, 1)
    }

    return createJsonResponse({ message: "Cart cleared" })
  })

  return router
}
