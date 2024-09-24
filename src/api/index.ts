import { createElysia } from "@libs/elysia";
import { PortfolioController } from "./controller/portfolio.controller";
import { WorkController } from "./controller/work.controller";
import { MessageController } from "./controller/message.controller";
import { auth } from "./controller/auth";
import { me } from "./controller/user.controller";

const apiRoutes = createElysia({ prefix: "v2/" })
  .group("auth", (api) => api.use(auth))
  .group("me", (api) => api.use(me))
  .group("message", (api) => api.use(MessageController))
  .group("work", (api) => api.use(WorkController))
  .group("portfolio", (api) => api.use(PortfolioController));

export default apiRoutes;
