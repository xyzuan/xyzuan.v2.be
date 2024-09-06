import { createElysia } from "@libs/elysia";
import { PortfolioController } from "./portfolio/portfolio.controller";
import { WorkController } from "./work/work.controller";
import { auth } from "./auth";
import { me } from "./user/user";

const apiRoutes = createElysia({ prefix: "v2/" })
  .group("auth", (api) => api.use(auth))
  .group("me", (api) => api.use(me))
  .group("work", (api) => api.use(WorkController))
  .group("portfolio", (api) => api.use(PortfolioController));

export default apiRoutes;
