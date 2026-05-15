import { Elysia } from "elysia";

import { fetchEmployeesPayrollsDetails } from "../../controllers";

import { authenticationPlugin, authorizationPlugin } from "../../plugins";

import { PaginationSchema } from "../../validations";

const adminFinanceRoutes = new Elysia({ prefix: "/finance" })

adminFinanceRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/employees-payrolls-details", fetchEmployeesPayrollsDetails, { query: PaginationSchema });

    return app
})

export { adminFinanceRoutes }