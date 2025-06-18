import { OpenAPIRoute } from "chanfana"
import type { Context } from "hono"
import { UserSchema, ErrorResponseSchema } from "../../schemas"
import { authenticate } from "../../utils/auth"
import type { User, Session } from "../../types"

export class AuthProfile extends OpenAPIRoute {
  schema = {
    tags: ["Authentication"],
    summary: "Get current user profile",
    security: [{ bearerAuth: [] }],
    responses: {
      "200": {
        description: "User profile",
        content: {
          "application/json": {
            schema: UserSchema.omit({ password: true }),
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
    },
  }

  async handle(c: Context) {
    const users: User[] = c.get("users") || []
    const sessions: Session[] = c.get("sessions") || []

    const userId = authenticate(c.req.raw, sessions)
    if (!userId) {
      return c.json({ error: "Authentication required" }, 401)
    }

    const user = users.find((u) => u.id === userId)
    if (!user) {
      return c.json({ error: "User not found" }, 404)
    }

    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      createdAt: user.createdAt,
    })
  }
}
