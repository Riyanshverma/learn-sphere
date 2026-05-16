import { Elysia } from "elysia";

import { addNewSchoolStaff, addExistingUserAsSchoolStaff, sendTeacherInvitation, sendStudentInvitation, fetchTeacherInvitations, changeInvitationStatus, createSchoolClass, changeClassTeacher, addClassSubject, fetchParentInvitations, addStudentWithExistingUserParent, addStudentWithNewParent, addStudentToClassAndAcceptInvitation, fetchAllClassesDetails, searchTeachers, searchTeachersForClassTeacher } from "../../controllers";

import { authenticationPlugin, authorizationPlugin, jwtPlugin } from "../../plugins";

import { EmployeeSignupSchema, ExistingUserAsStaffSchema, CreateSchoolClassSchema, SendInvitationSchema, InvitationJWTSchema, UpdateInvitationStatusSchema, UpdateClassTeacherSchema, AddClassSubjectSchema, StudentWithExistingUserParentSchema, StudentWithNewParentSchema, AddStudentToClassAndAcceptInvitationSchema, SearchSchema } from "../../validations";

const adminSchoolAcademicRoutes = new Elysia({ prefix: "/school-academic" })

adminSchoolAcademicRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.post("/add-new-school-staff", addNewSchoolStaff, { body: EmployeeSignupSchema })

    app.post("/add-existing-user-as-school-staff", addExistingUserAsSchoolStaff, { body: ExistingUserAsStaffSchema })

    app.post("/add-new-student", addStudentWithNewParent, { body: StudentWithNewParentSchema })

    app.post("/add-student-with-existing-user-parent", addStudentWithExistingUserParent, { body: StudentWithExistingUserParentSchema })

    app.use(jwtPlugin(InvitationJWTSchema)).post("/send-teacher-invitation", sendTeacherInvitation, { body: SendInvitationSchema })
    
    app.get("/teacher-invitations", fetchTeacherInvitations)
    
    app.patch("/update-invitation-status", changeInvitationStatus, { body: UpdateInvitationStatusSchema })
    
    app.use(jwtPlugin(InvitationJWTSchema)).post("/send-student-invitation", sendStudentInvitation, { body: SendInvitationSchema })

    app.get("/parent-invitations", fetchParentInvitations)

    app.patch('/update-student-class-and-invitation-status', addStudentToClassAndAcceptInvitation, { body: AddStudentToClassAndAcceptInvitationSchema })

    app.post("/create-class", createSchoolClass, { body: CreateSchoolClassSchema })

    app.patch("/update-class-teacher", changeClassTeacher, { body: UpdateClassTeacherSchema })

    app.get("/all-classes-details", fetchAllClassesDetails)

    app.get("/search-teachers", searchTeachers, { query: SearchSchema })
    
    app.post("/add-class-subject", addClassSubject, { body: AddClassSubjectSchema })

    app.get("/search-teachers-for-class-teacher", searchTeachersForClassTeacher, { query: SearchSchema })

    return app
})

export { adminSchoolAcademicRoutes }