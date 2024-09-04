import { t } from "elysia";

import { createElysia } from "@utils/createElysia";
import { PortfolioService } from "./portfolio.service";
import { PortfolioWithStackSchema } from "./portfolio.schema";

const portfolioService = new PortfolioService();

export const PortfolioController = createElysia()
  .model({
    "portfolio.model": t.Object({
      content: t.String(),
      img: t.String(),
      href: t.String(),
      title: t.String(),
      stacks: t.Array(t.String()),
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
