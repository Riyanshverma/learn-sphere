import { Elysia } from "elysia";
import { adminRouter } from "./admin";
import { parentRouter } from "./parent";
import { staffRouter } from "./staff";
import { teacherRouter } from "./teacher";

const apiRouter = new Elysia({ prefix: "/api" })

apiRouter.use(adminRouter)

apiRouter.use(parentRouter)

apiRouter.use(staffRouter)

apiRouter.use(teacherRouter)

export { apiRouter }