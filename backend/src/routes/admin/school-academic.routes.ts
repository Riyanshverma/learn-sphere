import { Elysia } from "elysia";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations, changeTeacherInvitationStatus, createSchoolClass } from "../../controllers";
import { authenticationPlugin, authorizationPlugin, jwtPlugin } from "../../plugins";
import { EmployeeSignupSchema, ExistingUserAsStaffSchema, CreateSchoolClassSchema, SendTeacherInvitationSchema, TeacherInviteJWTSchema, UpdateTeacherInvitationStatusSchema } from "../../validations";

const adminSchoolAcademicRoutes = new Elysia({ prefix: "/school-academic" })

adminSchoolAcademicRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.post("/add-new-school-staff", addNewSchoolStaff, { body: EmployeeSignupSchema })
    app.post("/add-existing-user-as-school-staff", addExistingUserAsSchoolStaff, { body: ExistingUserAsStaffSchema })

    app.use(jwtPlugin(TeacherInviteJWTSchema)).post("/send-teacher-invitation", sendTeacherInvitation, { body: SendTeacherInvitationSchema })

    app.get("/teacher-invitations", fetchTeacherInvitations)

    app.patch("/update-teacher-invitation-status", changeTeacherInvitationStatus, { body: UpdateTeacherInvitationStatusSchema })

    app.post("/create-class", createSchoolClass, { body: CreateSchoolClassSchema })

    return app
})

export { adminSchoolAcademicRoutes }