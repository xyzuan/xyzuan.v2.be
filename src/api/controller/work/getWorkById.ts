import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:id",
  async ({ params: { id } }) => {
    return {
      status: 200,
      data: await prismaClient.work.findUnique({
        where: { id: parseInt(id) },
        include: {
          responsibilities: true,
        },
      }),
    };
  },
  {
    detail: {
      tags: ["Works"],
    },
  }
);
