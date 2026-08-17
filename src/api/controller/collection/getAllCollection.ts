import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async () => {
    const collection = await prismaClient.collection.findMany({
      orderBy: [
        {
          isFeatured: "desc",
        },
        {
          id: "desc",
        },
      ],
    });
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
