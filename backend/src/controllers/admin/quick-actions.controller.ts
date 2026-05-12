import { type Context } from "elysia";

import type { DateType, UpdateSingleEmployeeAttendanceType, ApplyForLeaveType, EmployeeIdType, LeaveApplicationIdType } from "../../validations";

import { cancelMyLeaveApplication, createLeaveApplication, getEmployeesAttendance, getMyLeaveApplications, updateSingleEmployeeAttendance } from "../../services";

export const fetchEmployeesAttendance = async (context: Context<{ query: DateType }>) => {
  try {    
    const employees_attendance = await getEmployeesAttendance(context.query.date)

    return context.status(200, { success: true, message: "Employees attendance fetched successfully", data: employees_attendance })
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const changeEmployeeAttendance = async (context: Context<{ body: UpdateSingleEmployeeAttendanceType }>) => {
  try {
    await updateSingleEmployeeAttendance(context.body);

    return context.status(200, { success: true, message: "Attendance updated successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const applyForLeaveApplication = async (context: Context<{ body: ApplyForLeaveType }>) => {
  try {    
    await createLeaveApplication(context.body)

    return context.status(201, { success: true, message: "Leave application submitted successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const fetchMyLeaveApplications = async (context: Context<{ query: EmployeeIdType }>) => {
  try {
    const my_leave_applications = await getMyLeaveApplications(context.query.employee_id)

    return context.status(200, { success: true, message: "Leave applications fetched successfully", data: my_leave_applications });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
};

export const cancelLeaveApplication = async (context: Context<{ body: LeaveApplicationIdType }>) => {
  try {
    await cancelMyLeaveApplication(context.body.leave_application_id)

    return context.status(200, { success: true, message: "Leave application cancelled successfully" });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}