import { Elysia } from "elysia";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, fetchTeacherInvitations } from "../../controllers";
import { authenticationPlugin, authorizationPlugin, jwtPlugin } from "../../plugins";
import { EmployeeSignupSchema, ExistingUserAsStaffSchema, SendTeacherInvitationSchema, TeacherInviteJWTSchema } from "../../validations";

const adminSchoolAcademicRoutes = new Elysia({ prefix: "/school-academic" })

adminSchoolAcademicRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.post("/add-new-school-staff", addNewSchoolStaff, { body: EmployeeSignupSchema })
    app.post("/add-existing-user-as-school-staff", addExistingUserAsSchoolStaff, { body: ExistingUserAsStaffSchema })

    app.use(jwtPlugin(TeacherInviteJWTSchema)).post("/send-teacher-invitation", sendTeacherInvitation, { body: SendTeacherInvitationSchema })

    app.get("/teacher-invitations", fetchTeacherInvitations)

    return app
})

export { adminSchoolAcademicRoutes }