import { type Context } from "elysia";

import type {  } from "../../validations";

import { getAllSchoolTeachers } from "../../services";

export const fetchAllSchoolTeachers = async (context: Context) => {
  try {
    const school_teachers = await getAllSchoolTeachers();

    return context.status(200, { success: true, message: "School teachers fetched successfully", data: school_teachers });
  } catch (error: any) {
    return context.status(error.status || 500, { success: false, error: error.message || "Internal server error", code: error.code || "internal_server_error"});
  }
}