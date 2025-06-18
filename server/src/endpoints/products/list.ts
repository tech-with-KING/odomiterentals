import { OpenAPIRoute } from "chanfana"
import type { Context } from "hono"
import { ProductQuerySchema, ProductListResponseSchema } from "../../schemas"
import type { Product } from "../../types"

export class ProductList extends OpenAPIRoute {
  schema = {
    tags: ["Products"],
    summary: "List products with filtering and pagination",
    request: {
      query: ProductQuerySchema,
    },
    responses: {
      "200": {
        description: "List of products",
        content: {
          "application/json": {
            schema: ProductListResponseSchema,
          },
        },
      },
    },
  }

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>()
    const { primary_category, secondary_category, search, status, page, limit, sortBy, sortOrder } = data.query

    const products: Product[] = c.get("products") || []
    let filteredProducts = [...products]

    // Apply filters
    if (primary_category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.primary.toLowerCase() === primary_category.toLowerCase(),
      )
    }

    if (secondary_category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.secondary.toLowerCase() === secondary_category.toLowerCase(),
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

    return c.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: limit,
      },
    })
  }
}
