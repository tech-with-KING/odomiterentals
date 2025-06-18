import { fromHono } from "chanfana"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { dataStoreMiddleware } from "./middleware/dataStore"

// Auth endpoints
import { AuthRegister } from "./endpoints/auth/register"
import { AuthLogin } from "./endpoints/auth/login"
import { AuthProfile } from "./endpoints/auth/profile"

// Product endpoints
import { ProductList } from "./endpoints/products/list"
import { ProductCreate } from "./endpoints/products/create"

type Env = {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  data: KVNamespace
}

// Start a Hono app
const app = new Hono<{ Bindings: Env }>()

// Add CORS middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
)

// Add data store middleware
app.use("*", dataStoreMiddleware)

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
  openapi_url: "/openapi.json",
  title: "Event Rental API",
  version: "2.0.0",
  description: "API for managing event rentals, including authentication and product management.",
  servers: [
    {
      url: "https://your-worker.your-subdomain.workers.dev",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
})

// Register OpenAPI endpoints

// Authentication routes
openapi.post("/api/auth/register", AuthRegister)
openapi.post("/api/auth/login", AuthLogin)
openapi.get("/api/auth/profile", AuthProfile)

// Product routes
openapi.get("/api/products", ProductList)
openapi.post("/api/products", ProductCreate)

// Health check endpoint (non-OpenAPI)
app.get("/api/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  })
})

// Export the Hono app
export default app
