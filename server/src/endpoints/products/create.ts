import { OpenAPIRoute } from "chanfana"
import type { Context } from "hono"
import { CreateProductSchema, ProductSchema, ErrorResponseSchema } from "../../schemas"
import { generateId, requireAdmin } from "../../utils/auth"
import type { Product, User, Session } from "../../types"

export class ProductCreate extends OpenAPIRoute {
  schema = {
    tags: ["Products"],
    summary: "Create a new product (Admin only)",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateProductSchema,
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Product created successfully",
        content: {
          "application/json": {
            schema: ProductSchema,
          },
        },
      },
      "400": {
        description: "Bad request",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "401": {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "403": {
        description: "Admin access required",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  }

  async handle(c: Context) {
    const users: User[] = c.get("users") || []
    const sessions: Session[] = c.get("sessions") || []
    const products: Product[] = c.get("products") || []

    const userId = requireAdmin(c.req.raw, sessions, users)
    if (typeof userId !== "string") {
      return userId
    }

    const data = await this.getValidatedData<typeof this.schema>()
    const productData = data.body

    const product: Product = {
      id: productData.id || generateId(),
      name: productData.name,
      description: productData.description,
      category: productData.category,
      specifications: productData.specifications,
      pricing: {
        rental: {
          weekly: productData.pricing.rental.weekly,
          currency: productData.pricing.rental.currency,
          formatted: productData.pricing.rental.formatted,
        },
      },
      images: productData.images,
      availability: productData.availability,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    products.push(product)

    return c.json(product, 201)
  }
}
