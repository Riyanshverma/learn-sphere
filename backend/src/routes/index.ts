import { Elysia } from "elysia";

import { adminRouter } from "./admin";

import { parentRouter } from "./parent";

import { staffRouter } from "./staff";

import { teacherRouter } from "./teacher";

import { userLoginWithPassword, userLogout, userLoginWithOtp, userOtpVerification } from "../utils";

import { UserLoginWithPasswordSchema, UserLoginWithOtpSchema, UserOtpVerificationSchema } from "../validations";

import { globalPlugin, authenticationPlugin, authorizationPlugin, webhookAuthorizationPlugin } from "../plugins";

import { employeePayrollByOnlineWebhook } from "../controllers";

const apiRouter = new Elysia({ prefix: "/api" })

apiRouter.use(globalPlugin)

apiRouter.group('/webhooks', (app) => app.use(webhookAuthorizationPlugin).post('/employee-payroll-by-online', employeePayrollByOnlineWebhook))

apiRouter.post('/auth/log-in-with-password', userLoginWithPassword, { body: UserLoginWithPasswordSchema })

apiRouter.post('/auth/log-in-with-otp', userLoginWithOtp, { body: UserLoginWithOtpSchema })

apiRouter.post('/auth/log-in-otp-verify', userOtpVerification, { body: UserOtpVerificationSchema })

apiRouter.group('/auth', (app) => app.use(authenticationPlugin).use(authorizationPlugin('admin', 'teacher', 'staff', 'parent')).post('/log-out', userLogout))

apiRouter.use(adminRouter)

apiRouter.use(parentRouter)

apiRouter.use(staffRouter)

apiRouter.use(teacherRouter)

export { apiRouter }