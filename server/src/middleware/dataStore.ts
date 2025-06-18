import type { Context, Next } from "hono"
import { users, products, carts, sessions } from "../data/mockData"

export async function dataStoreMiddleware(c: Context, next: Next) {
  // Attach data stores to context
  c.set("users", users)
  c.set("products", products)
  c.set("carts", carts)
  c.set("sessions", sessions)

  await next()
}
