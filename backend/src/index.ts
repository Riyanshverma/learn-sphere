import { Elysia } from "elysia";
import { apiRouter } from "./routes";

const app = new Elysia()

app.use(apiRouter)

app.get("/api/health-test", ({ status }) => status(200, "Server running..."))

app.listen(3000, () => { console.log("Server running at http://localhost:3000") })
 