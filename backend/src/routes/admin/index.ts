import { Elysia } from "elysia";
import { adminAuthRoutes } from "./auth.routes";

const adminRouter = new Elysia({ prefix: "/admin" })

adminRouter.use(adminAuthRoutes)

export { adminRouter }
