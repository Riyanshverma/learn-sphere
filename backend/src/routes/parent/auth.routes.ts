import { Elysia } from "elysia";

const parentAuthRoutes = new Elysia({ prefix: "/auth" })

parentAuthRoutes.get("/identity-details", () => ({ message: "Parent identity details" }))

parentAuthRoutes.post("/sign-up", () => ({ message: "Parent signed up successfully" }))

export { parentAuthRoutes }