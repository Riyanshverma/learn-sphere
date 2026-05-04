import { Elysia } from "elysia";
import { teacherSignupWithSupabase, teacherSignupWithResend, teacherIdentityDetails } from "../../controllers";
import { authenticationPlugin, jwtPlugin } from "../../plugins";
import { TeacherSignupResendSchema, TeacherSignupSupabaseSchema, TeacherInviteJWTSchema, IdentityIdSchema } from "../../validations";

const teacherAuthRoutes = new Elysia({ prefix: "/auth" })

teacherAuthRoutes.group("", (app) => {
    app.use(jwtPlugin(TeacherInviteJWTSchema)).use(authenticationPlugin)

    app.post("/sign-up-resend", teacherSignupWithResend, { body: TeacherSignupResendSchema })
    app.post("/sign-up-supabase", teacherSignupWithSupabase, { body: TeacherSignupSupabaseSchema })

    return app
})

teacherAuthRoutes.use(authenticationPlugin).get("/identity-details", teacherIdentityDetails, { query: IdentityIdSchema })

export { teacherAuthRoutes }
