import { Elysia } from "elysia";
import { adminAuthRoutes } from "./auth.routes";
import { adminSchoolAcademicRoutes } from "./school-academic.routes";
import { adminQuickActionsRoutes } from "./quick-actions.routes";
import { adminFinanceRoutes } from "./finance.routes";

const adminRouter = new Elysia({ prefix: "/admin" })

adminRouter.use(adminAuthRoutes)
adminRouter.use(adminSchoolAcademicRoutes)
adminRouter.use(adminQuickActionsRoutes)
adminRouter.use(adminFinanceRoutes)

export { adminRouter }
