import { Router } from "itty-router"
import type { Product, User, Session, Cart } from "../types"
import { generateId, requireAdmin } from "../utils/auth"
import { createJsonResponse, createErrorResponse } from "../utils/cors"

export function createProductRoutes(products: Product[], users: User[], sessions: Session[], carts: Cart[]) {
  const router = Router()

  // Get all products with filtering and pagination
  router.get("/", (request) => {
    const url = new URL(request.url)
    const primaryCategory = url.searchParams.get("primary_category")
    const secondaryCategory = url.searchParams.get("secondary_category")
    const search = url.searchParams.get("search")
    const status = url.searchParams.get("status")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const sortBy = url.searchParams.get("sortBy") || "name"
    const sortOrder = url.searchParams.get("sortOrder") || "asc"

    let filteredProducts = [...products]

    // Apply filters
    if (primaryCategory) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.primary.toLowerCase() === primaryCategory.toLowerCase(),
      )
    }

    if (secondaryCategory) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.secondary.toLowerCase() === secondaryCategory.toLowerCase(),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter((p) => p.availability.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.specifications.material.toLowerCase().includes(searchLower) ||
          p.specifications.features.some((feature) => feature.toLowerCase().includes(searchLower)),
      )
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case "price":
          aVal = a.pricing.rental.weekly
          bVal = b.pricing.rental.weekly
          break
        case "created_at":
          aVal = new Date(a.created_at)
          bVal = new Date(b.created_at)
          break
        case "updated_at":
          aVal = new Date(a.updated_at)
          bVal = new Date(b.updated_at)
          break
        default:
          aVal = (a as any)[sortBy]
          bVal = (b as any)[sortBy]
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortOrder === "desc") {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return createJsonResponse({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: limit,
      },
    })
  })

  // Get single product by ID
  router.get("/:id", (request) => {
    const productId = request.params?.id
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return createErrorResponse("Product not found", 404)
    }

    return createJsonResponse(product)
  })

  // Get product categories
  router.get("/categories", () => {
    const primaryCategories = [...new Set(products.map((p) => p.category.primary))]
    const secondaryCategories = [...new Set(products.map((p) => p.category.secondary))]

    // Group secondary categories by primary
    const categoriesGrouped: Record<string, string[]> = {}
    products.forEach((product) => {
      const primary = product.category.primary
      const secondary = product.category.secondary

      if (!categoriesGrouped[primary]) {
        categoriesGrouped[primary] = []
      }

      if (!categoriesGrouped[primary].includes(secondary)) {
        categoriesGrouped[primary].push(secondary)
      }
    })

    return createJsonResponse({
      primary: primaryCategories,
      secondary: secondaryCategories,
      grouped: categoriesGrouped,
    })
  })

  // Create new product (Admin only)
  router.post("/", async (request) => {
    const userId = requireAdmin(request, sessions, users)
    if (userId instanceof Response) return userId

    try {
      const productData = await request.json()

      // Validation
      const required = ["name", "description", "category", "specifications", "pricing"]
      for (const field of required) {
        if (!productData[field]) {
          return createErrorResponse(`${field} is required`)
        }
      }

      // Validate category structure
      if (!productData.category.primary || !productData.category.secondary) {
        return createErrorResponse("Category must have both primary and secondary fields")
      }

      // Validate pricing structure
      if (!productData.pricing.rental || !productData.pricing.rental.weekly) {
        return createErrorResponse("Pricing must include rental.weekly rate")
      }

      const product: Product = {
        id: productData.id || generateId(),
        name: productData.name,
        description: productData.description,
        category: {
          primary: productData.category.primary,
          secondary: productData.category.secondary,
        },
        specifications: {
          dimensions: productData.specifications.dimensions || {},
          material: productData.specifications.material || "",
          features: productData.specifications.features || [],
        },
        pricing: {
          rental: {
            weekly: Number.parseFloat(productData.pricing.rental.weekly),
            currency: productData.pricing.rental.currency || "USD",
            formatted: productData.pricing.rental.formatted || `$${productData.pricing.rental.weekly}/week`,
          },
        },
        images: productData.images || [],
        availability: {
          status: productData.availability?.status || "available",
          stock_type: productData.availability?.stock_type || "rental",
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      products.push(product)

      return createJsonResponse(product, 201)
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Update product (Admin only)
  router.put("/:id", async (request) => {
    const userId = requireAdmin(request, sessions, users)
    if (userId instanceof Response) return userId

    try {
      const productId = request.params?.id
      const updateData = await request.json()

      const productIndex = products.findIndex((p) => p.id === productId)
      if (productIndex === -1) {
        return createErrorResponse("Product not found", 404)
      }

      const product = products[productIndex]

      // Update fields
      if (updateData.name !== undefined) product.name = updateData.name
      if (updateData.description !== undefined) product.description = updateData.description

      if (updateData.category) {
        if (updateData.category.primary !== undefined) {
          product.category.primary = updateData.category.primary
        }
        if (updateData.category.secondary !== undefined) {
          product.category.secondary = updateData.category.secondary
        }
      }

      if (updateData.specifications) {
        if (updateData.specifications.dimensions) {
          product.specifications.dimensions = {
            ...product.specifications.dimensions,
            ...updateData.specifications.dimensions,
          }
        }
        if (updateData.specifications.material !== undefined) {
          product.specifications.material = updateData.specifications.material
        }
        if (updateData.specifications.features !== undefined) {
          product.specifications.features = updateData.specifications.features
        }
      }

      if (updateData.pricing?.rental) {
        if (updateData.pricing.rental.weekly !== undefined) {
          product.pricing.rental.weekly = Number.parseFloat(updateData.pricing.rental.weekly)
        }
        if (updateData.pricing.rental.currency !== undefined) {
          product.pricing.rental.currency = updateData.pricing.rental.currency
        }
        if (updateData.pricing.rental.formatted !== undefined) {
          product.pricing.rental.formatted = updateData.pricing.rental.formatted
        }
      }

      if (updateData.images !== undefined) {
        product.images = updateData.images
      }

      if (updateData.availability) {
        if (updateData.availability.status !== undefined) {
          product.availability.status = updateData.availability.status
        }
        if (updateData.availability.stock_type !== undefined) {
          product.availability.stock_type = updateData.availability.stock_type
        }
      }

      product.updated_at = new Date().toISOString()

      return createJsonResponse(product)
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Delete product (Admin only)
  router.delete("/:id", (request) => {
    const userId = requireAdmin(request, sessions, users)
    if (userId instanceof Response) return userId

    const productId = request.params?.id
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return createErrorResponse("Product not found", 404)
    }

    // Remove product from all carts before deleting
    carts.forEach((cart) => {
      cart.items = cart.items.filter((item) => item.productId !== productId)
      cart.updatedAt = new Date().toISOString()
    })

    products.splice(productIndex, 1)

    return createJsonResponse({ message: "Product deleted successfully" })
  })

  return router
}
