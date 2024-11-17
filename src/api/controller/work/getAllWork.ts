import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async () => {
    return {
      status: 200,
      data: await prismaClient.work.findMany({
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
