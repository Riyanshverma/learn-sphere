import { type Context } from "elysia";

import { type PaginationType } from "../../validations";

import { getEmployeesPayrollsDetails } from "../../services";

export const fetchEmployeesPayrollsDetails = async (context: Context<({query: PaginationType})>) => {
  try {
    const employees_payrolls_details = await getEmployeesPayrollsDetails(context.query.page_number, context.query.limit);

    return context.status(200, { success: true, message: "Employees payrolls details fetched successfully", data: employees_payrolls_details });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}