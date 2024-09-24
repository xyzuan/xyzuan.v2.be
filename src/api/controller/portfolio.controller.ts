import { t } from "elysia";

import { prismaClient } from "@libs/prismaDatabase";
import { createElysia } from "@libs/elysia";
import { authGuard } from "@libs/authGuard";

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
        data: await prismaClient.portfolio.findMany({
          include: {
            stacks: true,
          },
          orderBy: [
            {
              isFeatured: "desc",
            },
          ],
        }),
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
        data: await prismaClient.portfolio.findUnique({
          where: { id: parseInt(id) },
          include: {
            stacks: true,
          },
        }),
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
    async ({ body }) => {
      return await prismaClient.portfolio.create({
        data: {
          ...body,
          stacks: {
            create: body.stacks.map((description: string) => ({
              description,
            })),
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          description: true,
          href: true,
          projectLink: true,
          img: true,
          isFeatured: true,
          stacks: {
            select: {
              id: true,
              description: true,
            },
          },
          createdAt: true,
        },
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
      await prismaClient.portfolio.delete({
        where: { id: parseInt(id) },
      });
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
    async ({ body, params: { id } }) => {
      let updatedData: any = body;
      if (body.stacks) {
        updatedData.stacks = {
          deleteMany: {},
          create: body.stacks.map((description) => ({
            description,
          })),
        };
      }
      await prismaClient.portfolio.update({
        where: { id: parseInt(id) },
        data: { ...updatedData },
        include: {
          stacks: true,
        },
      });
      return {
        status: 200,
        message: `Portfolio and related stacks updated successfully`,
      };
    },
    {
      body: "portfolio.model",
      detail: {
        tags: ["Portfolios"],
      },
    }
  );
