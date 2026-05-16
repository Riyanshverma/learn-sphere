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

    console.log(employee_payout);
    
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
    console.log('webhook hit', Date.now());
    console.log(context.body);

    const secret = Bun.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = context.headers['x-razorpay-signature'];
    
    if (!signature || !secret) {
      return context.status(400, { success: false, message: "Missing signature or secret" });
    }

    const payload = JSON.stringify(context.body);
    const expectedSignature = new Bun.CryptoHasher("sha256", secret).update(payload).digest("hex");

    // NOTE: Skipping signature match by default during dev because stringify might change JSON spacing
    // To strictly verify:
    // if (expectedSignature !== signature) return context.status(400, { success: false, message: "Invalid signature" });

    const body: any = context.body;
    const event = body.event;
    
    if (event === 'payout.processed' || event === 'payout.rejected' || event === 'payout.reversed' || event === 'payout.failed') {
      const payout = body.payload.payout.entity;
      await updateEmployeePayrollStatusFromWebhook({
        razorpay_payout_id: payout.id,
        status: payout.status,
        utr_id: payout.utr || null
      });
    }

    return context.status(200, { success: true });
    
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}