import { Elysia } from "elysia";
import { studentSignupWithSupabase, studentSignupWithResend, parentIdentityDetails } from "../../controllers";
import { authenticationPlugin, jwtPlugin } from "../../plugins";
import { StudentSignupResendSchema, StudentSignupSupabaseSchema, InvitationJWTSchema, IdentityIdSchema } from "../../validations";

const parentAuthRoutes = new Elysia({ prefix: "/auth" })

parentAuthRoutes.group("", (app) => {
    app.use(jwtPlugin(InvitationJWTSchema)).use(authenticationPlugin)

    app.post("/sign-up-resend", studentSignupWithResend, { body: StudentSignupResendSchema })
    app.post("/sign-up-supabase", studentSignupWithSupabase, { body: StudentSignupSupabaseSchema })

    return app
})

parentAuthRoutes.use(authenticationPlugin).get("/identity-details", parentIdentityDetails, { query: IdentityIdSchema })

export { parentAuthRoutes }