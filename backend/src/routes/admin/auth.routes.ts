import { Elysia } from "elysia";
import { adminSignin } from "../../controllers";

const adminAuthRoutes = new Elysia({ prefix: "/auth" })

adminAuthRoutes.post("/sign-up", adminSignin)

export { adminAuthRoutes }
