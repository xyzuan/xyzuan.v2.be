import { baseElysia } from "@libs/elysia";
import cors from "@elysiajs/cors";
import { docs } from "@libs/swagger";
import apiRoutes from "./api";

export const api = baseElysia()
  .use(
    cors({
      origin: ["xyzuan.my.id", "localhost:3000", "localhost"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(docs)
  .use(apiRoutes)
  .listen(Bun.env.PORT || 3031);

console.log(
  `🦊 xyzuanV2 APIs is running at ${api.server?.hostname}:${api.server?.port}`
);
