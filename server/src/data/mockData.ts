import type { User, Product, Cart, Session } from "../types"

export const users: User[] = [
  {
    id: "admin-1",
    email: "admin@rental.com",
    password: "YWRtaW4xMjNzYWx0", // admin123 hashed
    name: "Admin User",
    type: "admin",
    createdAt: new Date().toISOString(),
  },
]

export const products: Product[] = [
  {
    id: "modern-lounge-chair-001",
    name: "The Modern Lounge Chair",
    description: "A stylish and comfortable lounge chair perfect for any living space.",
    category: {
      primary: "Furniture",
      secondary: "Chairs",
    },
    specifications: {
      dimensions: {
        width: '30"',
        depth: '35"',
        height: '32"',
        formatted: '30"W x 35"D x 32"H',
      },
      material: "Upholstered in premium fabric with a sturdy wooden frame",
      features: ["Ergonomic design", "Plush cushioning", "Sleek, modern aesthetic"],
    },
    pricing: {
      rental: {
        weekly: 50,
        currency: "USD",
        formatted: "$50/week",
      },
    },
    images: [
      {
        url: "path/to/main-product-image.jpg",
        alt: "Modern wooden lounge chair with curved design",
        primary: true,
      },
    ],
    availability: {
      status: "available",
      stock_type: "rental",
    },
    created_at: "2025-06-18T00:00:00Z",
    updated_at: "2025-06-18T00:00:00Z",
  },
  {
    id: "executive-desk-002",
    name: "Executive Office Desk",
    description: "Professional wooden desk with ample storage and elegant design.",
    category: {
      primary: "Furniture",
      secondary: "Desks",
    },
    specifications: {
      dimensions: {
        width: '60"',
        depth: '30"',
        height: '30"',
        formatted: '60"W x 30"D x 30"H',
      },
      material: "Solid oak wood with metal accents",
      features: ["3 spacious drawers", "Cable management system", "Scratch-resistant surface"],
    },
    pricing: {
      rental: {
        weekly: 75,
        currency: "USD",
        formatted: "$75/week",
      },
    },
    images: [
      {
        url: "path/to/desk-image.jpg",
        alt: "Executive oak desk with drawers",
        primary: true,
      },
    ],
    availability: {
      status: "available",
      stock_type: "rental",
    },
    created_at: "2025-06-18T00:00:00Z",
    updated_at: "2025-06-18T00:00:00Z",
  },
]

export const carts: Cart[] = []
export const sessions: Session[] = []
