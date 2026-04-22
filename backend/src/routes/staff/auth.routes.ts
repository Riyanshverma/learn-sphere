import { Elysia } from "elysia";

const staffAuthRoutes = new Elysia({ prefix: "/auth" })

staffAuthRoutes.get("/identity-details", () => ({ message: "Staff identity details" }))

staffAuthRoutes.post("/sign-up", () => ({ message: "Staff signed up successfully" }));

export { staffAuthRoutes }
