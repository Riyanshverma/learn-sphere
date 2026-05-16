import { Elysia } from "elysia";

import { fetchEmployeesPayrollsDetails, employeePayrollByCash } from "../../controllers";

import { authenticationPlugin, authorizationPlugin } from "../../plugins";

import { PaginationSchema, ConfirmEmployeePayrollByCashSchema } from "../../validations";

const adminFinanceRoutes = new Elysia({ prefix: "/finance" })

adminFinanceRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/employees-payrolls-details", fetchEmployeesPayrollsDetails, { query: PaginationSchema });

    app.patch("/employee-payroll-by-cash", employeePayrollByCash, { body: ConfirmEmployeePayrollByCashSchema });

    return app
})

export { adminFinanceRoutes }