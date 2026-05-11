import { Elysia } from "elysia";
import { fetchEmployeesAttendance } from "../../controllers";
import { authenticationPlugin, authorizationPlugin } from "../../plugins";
import { DateSchema } from "../../validations";

const adminQuickActionsRoutes = new Elysia({ prefix: "/quick-actions" })

adminQuickActionsRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/employees-attendance", fetchEmployeesAttendance, { query: DateSchema })

    return app
})

export { adminQuickActionsRoutes }