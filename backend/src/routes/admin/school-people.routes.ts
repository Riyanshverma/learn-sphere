import { Elysia } from "elysia";

import { fetchAllSchoolTeachers } from "../../controllers";

import { authenticationPlugin, authorizationPlugin } from "../../plugins";

import {  } from "../../validations";

const adminSchoolPeopleRoutes = new Elysia({ prefix: "/school-people" })

adminSchoolPeopleRoutes.group("", (app) => {
    app.use(authenticationPlugin).use(authorizationPlugin('admin'))

    app.get("/all-school-teachers", fetchAllSchoolTeachers)

    return app
})

export { adminSchoolPeopleRoutes }