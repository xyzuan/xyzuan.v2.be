import { createElysia } from "@utils/createElysia";
import { PortfolioController } from "./portfolio/portfolio.controller";
import { WorkController } from "./work/work.controller";

const apiRoutes = createElysia()
  .group("portfolio", (api) => api.use(PortfolioController))
  .group("work", (api) => api.use(WorkController));

export default apiRoutes;
