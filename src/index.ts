import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";

import apiRoutes from "./api";

const api = new Elysia();
api.use(swagger());
api.use(apiRoutes);
api.listen(process.env.PORT || 3031);

console.log(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
);
