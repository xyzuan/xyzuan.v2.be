import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:id",
  async ({ params: { id }, set }) => {
    const collection = await prismaClient.collection.findUnique({
      where: { id: parseInt(id) },
    });
    if (!collection) {
      set.status = 404;
      return { status: 404, data: null };
    }

    return {
      status: 200,
      data: collection,
    };
  },
  {
    detail: {
      tags: ["Collections"],
    },
  }
);
