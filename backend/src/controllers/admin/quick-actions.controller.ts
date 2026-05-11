import { type Context } from "elysia";
import type { DateType } from "../../validations";
import { getEmployeesAttendance } from "../../services";

export const fetchEmployeesAttendance = async (context: Context<{ query: DateType }>) => {
  try {    
    const employees_attendance = await getEmployeesAttendance(context.query.date)

    return context.status(200, { success: true, message: "Employees attendance fetched successfully", data: employees_attendance })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};
