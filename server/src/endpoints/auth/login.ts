import { OpenAPIRoute } from "chanfana"
import type { Context } from "hono"
import { LoginSchema, AuthResponseSchema, ErrorResponseSchema } from "../../schemas"
import { generateToken, verifyPassword } from "../../utils/auth"
import type { User, Session } from "../../types"

export class AuthLogin extends OpenAPIRoute {
  schema = {
    tags: ["Authentication"],
    summary: "Login user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Login successful",
        content: {
          "application/json": {
            schema: AuthResponseSchema,
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
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  }

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>()
    const { email, password } = data.body

    const users: User[] = c.get("users") || []
    const sessions: Session[] = c.get("sessions") || []

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user || !verifyPassword(password, user.password)) {
      return c.json({ error: "Invalid credentials" }, 401)
    }

    // Create session
    const token = generateToken()
    const session: Session = {
      token,
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    sessions.push(session)

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        createdAt: user.createdAt,
      },
      token,
    })
  }
}
