import { baseElysia } from "@libs/elysia";
import cors from "@elysiajs/cors";
import { docs } from "@libs/swagger";
import apiRoutes from "./api";

const api = baseElysia()
  .use(
    cors({
      origin: ["xyzuan.my.id", "localhost:3000"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(docs)
  .use(apiRoutes)
  .listen(process.env.PORT || 3031);

console.log(
  `🦊 xyzuanV2 APIs is running at ${api.server?.hostname}:${api.server?.port}`
);
