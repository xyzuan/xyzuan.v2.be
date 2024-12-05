import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";
import portfolioModel from "@models/portfolio.model";

export default createElysia()
  .use(portfolioModel)
  .use(authGuard)
  .patch(
    "/:id",
    async ({ body, user, params: { id } }) => {
      if (!user.isAdmin) throw new ForbiddenException();

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

      await redis.del(`portfolio.${id}`);
      await redis.del(`portfolio.all`);

      return {
        status: 200,
        message: `Portfolio and related stacks updated successfully`,
      };
    },
    {
      body: "portfolio.patch.model",
      detail: {
        tags: ["Portfolios"],
      },
    }
  );
