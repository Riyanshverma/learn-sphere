import { Elysia } from "elysia";
import { studentSignupWithSupabase, studentSignupWithResend } from "../../controllers";
import { authenticationPlugin, jwtPlugin } from "../../plugins";
import { StudentSignupResendSchema, StudentSignupSupabaseSchema, InvitationJWTSchema } from "../../validations";

const parentAuthRoutes = new Elysia({ prefix: "/auth" })

parentAuthRoutes.group("", (app) => {
    app.use(jwtPlugin(InvitationJWTSchema)).use(authenticationPlugin)

    app.post("/sign-up-resend", studentSignupWithResend, { body: StudentSignupResendSchema })
    app.post("/sign-up-supabase", studentSignupWithSupabase, { body: StudentSignupSupabaseSchema })

    return app
})

export { parentAuthRoutes }