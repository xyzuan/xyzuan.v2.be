import { t } from "elysia";

import { createElysia } from "@utils/createElysia";
import { PortfolioService } from "./portfolio.service";
import { Portfolio } from "@prisma/client";

const portfolioService = new PortfolioService();

export const PortfolioController = createElysia()
  .model({
    "portfolio.model": t.Object({
      content: t.String(),
      img: t.String(),
      href: t.String(),
      title: t.String(),
    }),
  })
  .get("/", async () => {
    const portfolios = await portfolioService.getAllPortfolios();
    return portfolios;
  })
  .get("/:id", async ({ params: { id } }) => {
    const portfolios = await portfolioService.getPortfolioById(parseInt(id));
    return portfolios;
  })
  .post(
    "/",
    async ({ body }: { body: Omit<Portfolio, "id"> }) => {
      const { content, img, href, title } = body;
      const createPortfolio = await portfolioService.createPortfolio({
        content,
        img,
        href,
        title,
      });
      return createPortfolio;
    },
    {
      body: "portfolio.model",
      response: t.Object({
        id: t.Number(),
        title: t.String(),
        content: t.String(),
        href: t.String(),
        img: t.String(),
      }),
    }
  )
  .delete("/:id", async ({ params: { id } }) => {
    const portfolios = await portfolioService.deletePortfolio(parseInt(id));
    return portfolios;
  })
  .patch(
    "/:id",
    async ({
      params: { id },
      body,
    }: {
      params: { id: string };
      body: Omit<Portfolio, "id">;
    }) => {
      const { content, img, href, title } = body;
      const portfolios = await portfolioService.updatePortfolio(parseInt(id), {
        content,
        img,
        href,
        title,
      });
      return portfolios;
    },
    {
      body: "portfolio.model",
      response: t.Object({
        id: t.Number(),
        title: t.String(),
        content: t.String(),
        href: t.String(),
        img: t.String(),
      }),
    }
  );
