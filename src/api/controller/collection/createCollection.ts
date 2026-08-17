import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import collectionModel from "@models/collection.model";

export default createElysia()
  .use(collectionModel)
  .use(authGuard)
  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      const collection = await prismaClient.collection.create({
        data: { ...body },
      });

      set.status = 201;
      return {
        status: 201,
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
