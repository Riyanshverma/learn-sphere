import { Elysia } from "elysia";
import { fetchEmployeesAttendance, changeEmployeeAttendance } from "../../controllers";
import { authenticationPlugin, authorizationPlugin } from "../../plugins";
import { DateSchema, UpdateSingleEmployeeAttendanceSchema } from "../../validations";

const adminQuickActionsRoutes = new Elysia({ prefix: "/quick-actions" })

adminQuickActionsRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/employees-attendance", fetchEmployeesAttendance, { query: DateSchema })
    
    app.patch("/update-employee-attendance", changeEmployeeAttendance, { body: UpdateSingleEmployeeAttendanceSchema })

    return app
})

export { adminQuickActionsRoutes }