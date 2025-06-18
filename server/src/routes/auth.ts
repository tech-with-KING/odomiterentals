import { Router } from "itty-router"
import type { User, Session } from "../types"
import { generateId, generateToken, hashPassword, verifyPassword, requireAuth } from "../utils/auth"
import { createJsonResponse, createErrorResponse } from "../utils/cors"

export function createAuthRoutes(users: User[], sessions: Session[]) {
  const router = Router()

  // Register new user
  router.post("/register", async (request) => {
    try {
      const { email, password, name, type = "customer" } = await request.json()

      // Validation
      if (!email || !password || !name) {
        return createErrorResponse("Email, password, and name are required")
      }

      if (!["customer", "admin"].includes(type)) {
        return createErrorResponse('Invalid user type. Must be "customer" or "admin"')
      }

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return createErrorResponse("User already exists", 409)
      }

      // Create user
      const user: User = {
        id: generateId(),
        email,
        password: hashPassword(password),
        name,
        type,
        createdAt: new Date().toISOString(),
      }

      users.push(user)

      // Create session
      const token = generateToken()
      const session: Session = {
        token,
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }

      sessions.push(session)

      return createJsonResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            type: user.type,
            createdAt: user.createdAt,
          },
          token,
        },
        201,
      )
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Login user
  router.post("/login", async (request) => {
    try {
      const { email, password } = await request.json()

      if (!email || !password) {
        return createErrorResponse("Email and password are required")
      }

      // Find user
      const user = users.find((u) => u.email === email)
      if (!user || !verifyPassword(password, user.password)) {
        return createErrorResponse("Invalid credentials", 401)
      }

      // Create session
      const token = generateToken()
      const session: Session = {
        token,
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }

      sessions.push(session)

      return createJsonResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          createdAt: user.createdAt,
        },
        token,
      })
    } catch (error) {
      return createErrorResponse("Invalid request body")
    }
  })

  // Logout user
  router.post("/logout", (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    const authHeader = request.headers.get("Authorization")
    const token = authHeader!.substring(7)

    // Remove session
    const sessionIndex = sessions.findIndex((s) => s.token === token)
    if (sessionIndex >= 0) {
      sessions.splice(sessionIndex, 1)
    }

    return createJsonResponse({ message: "Logged out successfully" })
  })

  // Get current user profile
  router.get("/profile", (request) => {
    const userId = requireAuth(request, sessions)
    if (userId instanceof Response) return userId

    const user = users.find((u) => u.id === userId)

    return createJsonResponse({
      id: user!.id,
      email: user!.email,
      name: user!.name,
      type: user!.type,
      createdAt: user!.createdAt,
    })
  })

  return router
}
