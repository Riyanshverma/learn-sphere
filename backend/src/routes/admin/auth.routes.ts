import { Elysia } from "elysia";

const adminAuthRoutes = new Elysia({ prefix: "/auth" })

adminAuthRoutes.get("/identity-details", () => ({ message: "Admin identity details" }))

adminAuthRoutes.post("/sign-up", () => ({ message: "Admin signed up successfully" }))

export { adminAuthRoutes }
