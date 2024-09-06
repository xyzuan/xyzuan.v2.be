import swagger from "@elysiajs/swagger";

import apiRoutes from "./api";
import { baseElysia } from "@libs/elysia";

const api = baseElysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "xyzuan APIs Documentation",
          version: "2.0.0",
        },
        tags: [
          {
            name: "Portfolios",
            description: "Jody Yuantoro portofolios endpoints",
          },
          { name: "Works", description: "Jody Yuantoro works endpoints" },
        ],
      },
    })
  )
  .use(apiRoutes)
  .listen(process.env.PORT || 3031);

console.log(
  `🦊 Elysia is running at ${api.server?.hostname}:${api.server?.port}`
);
