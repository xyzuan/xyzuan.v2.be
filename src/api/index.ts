import { createElysia } from "@utils/createElysia";
import { PortfolioController } from "./portfolio/portfolio.controller";
import { WorkController } from "./work/work.controller";

const apiRoutes = createElysia()
  .group("work", (api) => api.use(WorkController))
  .group("portfolio", (api) => api.use(PortfolioController));

export default apiRoutes;
