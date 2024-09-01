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
    return {
      status: 200,
      data: await portfolioService.getAllPortfolios(),
    };
  })
  .get("/:id", async ({ params: { id } }) => {
    return {
      status: 200,
      data: await portfolioService.getPortfolioById(parseInt(id)),
    };
  })
  .post(
    "/",
    async ({ body }: { body: Omit<Portfolio, "id"> }) => {
      const { content, img, href, title } = body;
      return await portfolioService.createPortfolio({
        content,
        img,
        href,
        title,
      });
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
    return await portfolioService.deletePortfolio(parseInt(id));
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
