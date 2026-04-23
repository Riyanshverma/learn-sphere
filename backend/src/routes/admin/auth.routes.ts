import { Elysia } from "elysia";
import { adminSignup } from "../../controllers";

const adminAuthRoutes = new Elysia({ prefix: "/auth" })

adminAuthRoutes.post("/sign-up", adminSignup)

export { adminAuthRoutes }
