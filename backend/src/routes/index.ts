import { Elysia } from "elysia";
import { adminRouter } from "./admin";
import { parentRouter } from "./parent";
import { staffRouter } from "./staff";
import { teacherRouter } from "./teacher";
import { login } from "../utils";
import { userLoginSchema } from "../validations";

const apiRouter = new Elysia({ prefix: "/api" })

apiRouter.post('/auth/log-in', login, { body: userLoginSchema })

apiRouter.use(adminRouter)

apiRouter.use(parentRouter)

apiRouter.use(staffRouter)

apiRouter.use(teacherRouter)

export { apiRouter }