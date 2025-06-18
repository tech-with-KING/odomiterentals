import type { User, Session } from "../types"

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateToken(): string {
  return Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15)
}

export function hashPassword(password: string): string {
  // Simple hash - use proper hashing in production (bcrypt, etc.)
  return btoa(password + "salt")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function authenticate(request: Request, sessions: Session[]): string | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  const session = sessions.find((s) => s.token === token)

  if (!session || session.expiresAt < Date.now()) {
    return null
  }

  return session.userId
}

export function requireAuth(request: Request, sessions: Session[]): string | Response {
  const userId = authenticate(request, sessions)
  if (!userId) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
  return userId
}

export function requireAdmin(request: Request, sessions: Session[], users: User[]): string | Response {
  const userId = authenticate(request, sessions)
  if (!userId) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const user = users.find((u) => u.id === userId)
  if (!user || user.type !== "admin") {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  return userId
}
