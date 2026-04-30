import { Elysia } from "elysia";
import { addNewSchoolStaff, addExistingUserAsSchoolStaff } from "../../controllers";
import { authenticationPlugin, authorizationPlugin } from "../../plugins";
import { EmployeeSignupSchema } from "../../validations";

const adminSchoolAcademicRoutes = new Elysia({ prefix: "/school-academic" })

adminSchoolAcademicRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.post("/add-new-school-staff", addNewSchoolStaff, { body: EmployeeSignupSchema })
    app.post("/add-existing-user-as-school-staff", addExistingUserAsSchoolStaff)

    return app
})

export { adminSchoolAcademicRoutes }