import { z } from "zod"

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  type: z.enum(["customer", "admin"]),
  createdAt: z.string(),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  type: z.enum(["customer", "admin"]).optional().default("customer"),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const AuthResponseSchema = z.object({
  user: UserSchema.omit({ password: true }),
  token: z.string(),
})

// Product schemas
export const ProductDimensionsSchema = z.object({
  width: z.string().optional(),
  depth: z.string().optional(),
  height: z.string().optional(),
  formatted: z.string().optional(),
})

export const ProductSpecificationsSchema = z.object({
  dimensions: ProductDimensionsSchema,
  material: z.string(),
  features: z.array(z.string()),
})

export const ProductPricingSchema = z.object({
  rental: z.object({
    weekly: z.number(),
    currency: z.string(),
    formatted: z.string(),
  }),
})

export const ProductImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  primary: z.boolean(),
})

export const ProductAvailabilitySchema = z.object({
  status: z.enum(["available", "unavailable", "maintenance"]),
  stock_type: z.string(),
})

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  specifications: ProductSpecificationsSchema,
  pricing: ProductPricingSchema,
  images: z.array(ProductImageSchema),
  availability: ProductAvailabilitySchema,
  created_at: z.string(),
  updated_at: z.string(),
})

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: z.string().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
    itemsPerPage: z.number(),
  }),
})

// Cart schemas
export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  duration: z.number(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  addedAt: z.string(),
  updatedAt: z.string(),
})

export const CartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(CartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
  duration: z.number().min(1).default(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const UpdateCartItemSchema = z.object({
  quantity: z.number().min(1).optional(),
  duration: z.number().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Common response schemas
export const ErrorResponseSchema = z.object({
  error: z.string(),
})

export const MessageResponseSchema = z.object({
  message: z.string(),
})

// Query parameter schemas
export const ProductQuerySchema = z.object({
  primary_category: z.string().optional(),
  secondary_category: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(["available", "unavailable", "maintenance"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["name", "price", "created_at", "updated_at"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})
