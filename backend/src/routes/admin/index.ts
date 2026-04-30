import { Elysia } from "elysia";
import { adminAuthRoutes } from "./auth.routes";
import { adminSchoolAcademicRoutes } from "./school-academic.routes";

const adminRouter = new Elysia({ prefix: "/admin" })

adminRouter.use(adminAuthRoutes)
adminRouter.use(adminSchoolAcademicRoutes)

export { adminRouter }
