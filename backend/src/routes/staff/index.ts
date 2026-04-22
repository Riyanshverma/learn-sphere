import { Elysia } from "elysia";
import { staffAuthRoutes } from "./auth.routes";

const staffRouter = new Elysia({ prefix: "/staff" })

staffRouter.use(staffAuthRoutes)

export { staffRouter }
