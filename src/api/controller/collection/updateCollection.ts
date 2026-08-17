import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import collectionModel from "@models/collection.model";

export default createElysia()
  .use(collectionModel)
  .use(authGuard)
  .patch(
    "/:id",
    async ({ body, user, params: { id }, set }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      const existing = await prismaClient.collection.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existing) {
        set.status = 404;
        return { status: 404, data: null };
      }

      const collection = await prismaClient.collection.update({
        where: { id: parseInt(id) },
        data: { ...body },
      });

      return {
        status: 200,
        data: collection,
      };
    },
    {
      body: "collection.model",
      detail: {
        tags: ["Collections"],
      },
    }
  );
