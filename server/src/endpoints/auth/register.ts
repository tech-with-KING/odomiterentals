import { OpenAPIRoute } from "chanfana"
import type { Context } from "hono"
import { RegisterSchema, AuthResponseSchema, ErrorResponseSchema } from "../../schemas"
import { generateId, generateToken, hashPassword } from "../../utils/auth"
import type { User, Session } from "../../types"

export class AuthRegister extends OpenAPIRoute {
  schema = {
    tags: ["Authentication"],
    summary: "Register a new user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: RegisterSchema,
          },
        },
      },
    },
    responses: {
      "201": {
        description: "User registered successfully",
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
      "409": {
        description: "User already exists",
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
    const { email, password, name, type } = data.body

    // Get users and sessions from context (you'll need to set these up)
    const users: User[] = c.get("users") || []
    const sessions: Session[] = c.get("sessions") || []

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return c.json({ error: "User already exists" }, 409)
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

    return c.json(
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
  }
}
