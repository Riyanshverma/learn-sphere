import { Elysia } from "elysia";

import { fetchEmployeesAttendance, changeEmployeeAttendance, applyForLeaveApplication, fetchMyLeaveApplications, cancelLeaveApplication, fetchEmployeesLeaveApplications, searchStaff } from "../../controllers";

import { authenticationPlugin, authorizationPlugin } from "../../plugins";

import { DateSchema, UpdateSingleEmployeeAttendanceSchema, ApplyForLeaveSchema, EmployeeIdSchema, LeaveApplicationIdSchema, PaginationSchema, SearchSchema } from "../../validations";

const adminQuickActionsRoutes = new Elysia({ prefix: "/quick-actions" })

adminQuickActionsRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/employees-attendance", fetchEmployeesAttendance, { query: DateSchema })
    
    app.patch("/update-employee-attendance", changeEmployeeAttendance, { body: UpdateSingleEmployeeAttendanceSchema })

    app.post("/apply-for-leave-application", applyForLeaveApplication, { body: ApplyForLeaveSchema })

    app.get("/my-leave-applications", fetchMyLeaveApplications, { query: EmployeeIdSchema })

    app.patch("/cancel-leave-application", cancelLeaveApplication, { body: LeaveApplicationIdSchema })

    app.get("/employees-leave-applications", fetchEmployeesLeaveApplications, { query: PaginationSchema })

    app.get("/search-staff", searchStaff, { query: SearchSchema })

    return app
})

export { adminQuickActionsRoutes }