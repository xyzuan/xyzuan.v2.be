import { t } from "elysia";

import { PortfolioService } from "./portfolio.service";
import { PortfolioWithStackSchema } from "./portfolio.schema";
import { createElysia } from "@libs/elysia";
import { authGuard } from "@libs/authGuard";

const portfolioService = new PortfolioService();

export const PortfolioController = createElysia()
  .model({
    "portfolio.model": t.Object({
      img: t.String(),
      title: t.String(),
      description: t.Optional(t.String()),
      content: t.Optional(t.String()),
      href: t.Optional(t.String()),
      projectLink: t.Optional(t.String()),
      isFeatured: t.Boolean(),
      stacks: t.Array(t.String()),
      createdAt: t.Optional(t.Date()),
    }),
  })
  .get(
    "/",
    async () => {
      return {
        status: 200,
        data: await portfolioService.getAllPortfolios(),
      };
    },
    {
      detail: {
        tags: ["Portfolios"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return {
        status: 200,
        data: await portfolioService.getPortfolioById(parseInt(id)),
      };
    },
    {
      detail: {
        tags: ["Portfolios"],
      },
    }
  )
  .use(authGuard)
  .post(
    "/",
    async ({ body }: { body: Omit<PortfolioWithStackSchema, "id"> }) => {
      return await portfolioService.createPortfolio({
        ...body,
      });
    },
    {
      body: "portfolio.model",
      detail: {
        tags: ["Portfolios"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await portfolioService.deletePortfolio(parseInt(id));
      return {
        status: 200,
        message: "Portfolio and related stacks deleted successfully",
      };
    },
    {
      detail: {
        tags: ["Portfolios"],
      },
    }
  )
  .patch(
    "/:id",
    async ({
      params: { id },
      body,
    }: {
      params: { id: string };
      body: PortfolioWithStackSchema;
    }) => {
      await portfolioService.updatePortfolio(parseInt(id), { ...body });
      return {
        status: 200,
        message: `Portfolio and related stacks updated successfully`,
      };
    },
    {
      detail: {
        tags: ["Portfolios"],
      },
    }
  );
