import { baseElysia } from "@libs/elysia";
import cors from "@elysiajs/cors";
import { docs } from "@libs/swagger";
import apiRoutes from "./api";
import { initializeRedisClient } from "@libs/redisClient";

export const api = baseElysia()
  .use(
    cors({
      origin: ["xyzuan.my.id", "xyzuan.com", "localhost:3000", "localhost"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(docs)
  .use(apiRoutes)
  .listen(Bun.env.PORT || 3031);

initializeRedisClient();

console.log(
  `🦊 xyzuanV2 APIs is running at ${api.server?.hostname}:${api.server?.port}`
);
