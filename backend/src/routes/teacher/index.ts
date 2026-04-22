import { Elysia } from "elysia";
import { teacherAuthRoutes } from "./auth.routes";

const teacherRouter = new Elysia({ prefix: "/teacher" })

teacherRouter.use(teacherAuthRoutes)

export { teacherRouter }
