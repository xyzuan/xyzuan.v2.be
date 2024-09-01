import { createElysia } from "@utils/createElysia";
import { PortfolioController } from "./portfolio/portfolio.controller";

const apiRoutes = createElysia({ prefix: "/api/v2" }).group(
  "/portfolio",
  (app) => app.use(PortfolioController)
);

export default apiRoutes;
