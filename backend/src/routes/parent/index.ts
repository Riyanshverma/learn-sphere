import { Elysia } from "elysia";
import { parentAuthRoutes } from "./auth.routes";

const parentRouter = new Elysia({ prefix: "/parent" })

parentRouter.use(parentAuthRoutes)

export { parentRouter }
