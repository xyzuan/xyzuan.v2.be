import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia()
  .use(authGuard)
  .delete(
    "/:id",
    async ({ params: { id }, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      await prismaClient.work.delete({
        where: { id: parseInt(id) },
      });
      return {
        status: 200,
        message: "Work and related responsibilities deleted successfully",
      };
    },
    {
      detail: {
        tags: ["Works"],
      },
    }
  );
