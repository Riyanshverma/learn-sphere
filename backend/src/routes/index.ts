import { Elysia } from "elysia";
import { adminRouter } from "./admin";
import { parentRouter } from "./parent";
import { staffRouter } from "./staff";
import { teacherRouter } from "./teacher";
import { userLoginWithPassword, userLogout, userLoginWithOtp } from "../utils";
import { UserLoginWithPasswordSchema, UserLoginWithOtpSchema } from "../validations";
import { globalPlugin, authenticationPlugin, authorizationPlugin } from "../plugins";

const apiRouter = new Elysia({ prefix: "/api" })

apiRouter.use(globalPlugin)

apiRouter.post('/auth/log-in-with-password', userLoginWithPassword, { body: UserLoginWithPasswordSchema })

apiRouter.post('/auth/log-in-with-otp', userLoginWithOtp, { body: UserLoginWithOtpSchema })

apiRouter.group('/auth', (app) => app.use(authenticationPlugin).use(authorizationPlugin('admin', 'teacher', 'staff', 'parent')).post('/log-out', userLogout))

apiRouter.use(adminRouter)

apiRouter.use(parentRouter)

apiRouter.use(staffRouter)

apiRouter.use(teacherRouter)

export { apiRouter }