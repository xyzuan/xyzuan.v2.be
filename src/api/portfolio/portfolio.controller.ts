import { createElysia } from "@utils/createElysia";
import { PortfolioService } from "./portfolio.service";

const portfolioService = new PortfolioService();

export const PortfolioController = createElysia({ prefix: "/portfolio" }).get(
  "/",
  async () => {
    const portfolios = await portfolioService.getAllPortfolios();
    return portfolios;
  }
);
