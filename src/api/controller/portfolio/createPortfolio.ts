import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import portfolioModel from "@models/portfolio.model";

export default createElysia()
  .use(portfolioModel)
  .use(authGuard)
  .post(
    "/",
    async ({ body, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();

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
  );
