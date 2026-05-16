import { type Context } from "elysia";

import type { PaginationType, ConfirmEmployeePayrollByCashType, ConfirmEmployeePayrollByOnlineType } from "../../validations";

import { getEmployeesPayrollsDetails, confirmEmployeePayrollByCash, razorpayService, confirmEmployeePayrollByOnline, updateEmployeePayrollStatusFromWebhook } from "../../services";

export const fetchEmployeesPayrollsDetails = async (context: Context<({query: PaginationType})>) => {
  try {
    const employees_payrolls_details = await getEmployeesPayrollsDetails(context.query.page_number, context.query.limit);

    return context.status(200, { success: true, message: "Employees payrolls details fetched successfully", data: employees_payrolls_details });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}

export const employeePayrollByCash = async (context: Context<({body: ConfirmEmployeePayrollByCashType})>) => {
  try {
    await confirmEmployeePayrollByCash(context.body);

    return context.status(200, { success: true, message: "Employee payroll by cash confirmed successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}

export const employeePayrollByOnline = async (context: Context<({body: ConfirmEmployeePayrollByOnlineType})>) => {
  try {
    const employee_payout = await razorpayService.createRazorpayPayout(context.body);
    
    await confirmEmployeePayrollByOnline({ 
      payroll_id: context.body.payroll_id, 
      employee_id: context.body.employee_id,
      net_salary: context.body.net_salary,
      deductions: context.body.deductions,
      razorpay_payout_id: employee_payout.id,
      status: employee_payout.status,
      utr_id: employee_payout.utr,
      paid_at: new Date(employee_payout.created_at * 1000),
    });

    return context.status(200, { success: true, message: "Online payroll transfer initiated successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}

export const employeePayrollByOnlineWebhook = async (context: Context) => {
  try {
    await updateEmployeePayrollStatusFromWebhook({
      razorpay_payout_id: (context as any).webhook_data.id,
      status: (context as any).webhook_data.status,
      utr_id: (context as any).webhook_data.utr,
      paid_at: new Date((context as any).webhook_data.created_at * 1000),
    });

    return context.status(200, { success: true, message: "Employee payroll by online webhook updated successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}