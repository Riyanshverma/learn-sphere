import { Elysia } from "elysia";
import { apiRouter } from "./routes";
import { cors } from '@elysiajs/cors'

const app = new Elysia()

app.use(cors({
  origin: Bun.env.FRONTEND_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 600,
}))


app.use(apiRouter)

app.get("/api/health-test", ({ status }) => status(200, "Server running..."))

app.listen(Bun.env.PORT, () => { console.log(`Server running at http://localhost:${Bun.env.PORT}`) });