import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:id",
  async ({ params: { id } }) => {
    return {
      status: 200,
      data: await prismaClient.portfolio.findUnique({
        where: { id: parseInt(id) },
        include: {
          stacks: true,
        },
      }),
    };
  },
  {
    detail: {
      tags: ["Portfolios"],
    },
  }
);
