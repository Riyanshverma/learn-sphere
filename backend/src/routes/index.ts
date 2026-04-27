import { Elysia } from "elysia";
import { adminRouter } from "./admin";
import { parentRouter } from "./parent";
import { staffRouter } from "./staff";
import { teacherRouter } from "./teacher";
import { userLogin, userLogout } from "../utils";
import { userLoginSchema } from "../validations";
import { globalPlugin, authenticationPlugin, authorizationPlugin } from "../plugins";

const apiRouter = new Elysia({ prefix: "/api" })

apiRouter.use(globalPlugin)

apiRouter.post('/auth/log-in', userLogin, { body: userLoginSchema })

apiRouter.group('/auth', (app) => app.use(authenticationPlugin).use(authorizationPlugin('admin', 'teacher', 'staff', 'parent')).post('/log-out', userLogout))

apiRouter.use(adminRouter)

apiRouter.use(parentRouter)

apiRouter.use(staffRouter)

apiRouter.use(teacherRouter)

export { apiRouter }