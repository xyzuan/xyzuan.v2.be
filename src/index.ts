import { Elysia } from "elysia";
import apiRoutes from "./api";

const api = new Elysia();
api.use(apiRoutes);
api.get("/", () => "Welcome to Elysia!");
api.listen(process.env.PORT || 3031);

console.log(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
);
