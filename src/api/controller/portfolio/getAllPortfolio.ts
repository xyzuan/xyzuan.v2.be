import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async () => {
    return {
      status: 200,
      data: await prismaClient.portfolio.findMany({
        include: {
          stacks: true,
        },
        orderBy: [
          {
            isFeatured: "desc",
          },
        ],
      }),
    };
  },
  {
    detail: {
      tags: ["Portfolios"],
    },
  }
);
