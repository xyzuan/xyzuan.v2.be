import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia()
  .use(authGuard)
  .delete(
    "/:id",
    async ({ user, params: { id }, set }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      const existing = await prismaClient.collection.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existing) {
        set.status = 404;
        return { status: 404, data: null };
      }

      await prismaClient.collection.delete({
        where: { id: parseInt(id) },
      });

      return {
        status: 200,
        data: { id: parseInt(id) },
      };
    },
    {
      detail: {
        tags: ["Collections"],
      },
    }
  );
