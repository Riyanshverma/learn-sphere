import { Elysia } from "elysia";
import { adminSignup, adminIdentityDetails } from "../../controllers";
import { EmployeeSignupSchema, identityIdSchema } from "../../validations";
import { authenticationPlugin } from "../../plugins";

const adminAuthRoutes = new Elysia({ prefix: "/auth" })

adminAuthRoutes.post("/sign-up", adminSignup, { body: EmployeeSignupSchema })

adminAuthRoutes.use(authenticationPlugin).get("/identity-details", adminIdentityDetails, { query: identityIdSchema })

export { adminAuthRoutes }