import { t } from "elysia";

import { createElysia } from "@utils/createElysia";
import { PortfolioService } from "./portfolio.service";
import { PortfolioWithStackSchema } from "./portfolio.schema";

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
    async ({ body }: { body: Omit<PortfolioWithStackSchema, "id"> }) => {
      return await portfolioService.createPortfolio({
        ...body,
      });
    },
    {
      body: "portfolio.model",
    }
  )
  .delete("/:id", async ({ params: { id } }) => {
    await portfolioService.deletePortfolio(parseInt(id));
    return {
      status: 200,
      message: "Portfolio and related stacks deleted successfully",
    };
  })
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
    }
  );
