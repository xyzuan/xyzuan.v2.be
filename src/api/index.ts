import { createElysia } from "@utils/createElysia";
import { PortfolioController } from "./portfolio/portfolio.controller";

const apiRoutes = createElysia();

apiRoutes.use(PortfolioController);

export default apiRoutes;
