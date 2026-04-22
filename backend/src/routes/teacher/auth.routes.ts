import { Elysia } from "elysia";

const teacherAuthRoutes = new Elysia({ prefix: "/auth" })

teacherAuthRoutes.get("/identity-details", () => ({ message: "Teacher identity details" }))

teacherAuthRoutes.post("/sign-up", () => ({ message: "Teacher signed up successfully" }));

export { teacherAuthRoutes }
