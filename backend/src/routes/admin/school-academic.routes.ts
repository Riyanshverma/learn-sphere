import { Elysia } from "elysia";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, sendStudentInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, createClassSubject } from "../../controllers";
import { authenticationPlugin, authorizationPlugin, jwtPlugin } from "../../plugins";
import { EmployeeSignupSchema, ExistingUserAsStaffSchema, CreateSchoolClassSchema, SendInvitationSchema, InvitationJWTSchema, UpdateInvitationStatusSchema, UpdateClassTeacherSchema, CreateClassSubjectSchema } from "../../validations";

const adminSchoolAcademicRoutes = new Elysia({ prefix: "/school-academic" })

adminSchoolAcademicRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.post("/add-new-school-staff", addNewSchoolStaff, { body: EmployeeSignupSchema })
    app.post("/add-existing-user-as-school-staff", addExistingUserAsSchoolStaff, { body: ExistingUserAsStaffSchema })

    app.use(jwtPlugin(InvitationJWTSchema)).post("/send-teacher-invitation", sendTeacherInvitation, { body: SendInvitationSchema })

    app.use(jwtPlugin(InvitationJWTSchema)).post("/send-student-invitation", sendStudentInvitation, { body: SendInvitationSchema })

    app.get("/teacher-invitations", fetchTeacherInvitations)

    app.patch("/update-invitation-status", changeInvitationStatus, { body: UpdateInvitationStatusSchema })

    app.post("/create-class", createSchoolClass, { body: CreateSchoolClassSchema })

    app.patch("/update-class-teacher", changeClassTeacher, { body: UpdateClassTeacherSchema })

    app.post("/create-class-subject", createClassSubject, { body: CreateClassSubjectSchema })

    return app
})

export { adminSchoolAcademicRoutes }