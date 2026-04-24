import { Elysia } from "elysia";
import { adminSignup } from "../../controllers";
import { adminSignupSchema } from "../../validations";

const adminAuthRoutes = new Elysia({ prefix: "/auth" })

adminAuthRoutes.post("/sign-up", adminSignup, { body: adminSignupSchema })

export { adminAuthRoutes }
