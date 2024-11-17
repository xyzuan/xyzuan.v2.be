import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia()
  .use(authGuard)
  .delete(
    "/:id",
    async ({ user, params: { id } }) => {
      if (!user.isAdmin) throw new ForbiddenException();

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
  );
